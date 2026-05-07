import RightPanel from "@/components/dashboard/RightPanel";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import {
  createExpense,
  getBillsByProfileAndHousehold,
  getExpensesWithBillsByHousehold,
  markBillPaid,
} from "@/api/expenses";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Bill {
  billId: number;
  description: string;
  amount: number;
  paid: boolean;
  payByDate: string;
  profileId: number;
  profileName: string;
  expenseId: number;
}

interface Expense {
  expenseId: number;
  description: string;
  amount: number;
  splitAmount: number;
  paid: boolean;
  paidByDate: string;
  createdAt: string;
  householdId: number;
  householdName: string;
  bills?: Bill[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  if (isNaN(amount) || amount == null) return "$0.00";
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.surfaceSoft,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedText
        style={{ fontSize: size * 0.35, fontWeight: "800", color: colors.text }}
      >
        {getInitials(name)}
      </ThemedText>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <ThemedText
      style={{
        fontSize: 11,
        fontWeight: "800",
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 12,
      }}
    >
      {title}
    </ThemedText>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View
      style={[styles.statCard, accent && { backgroundColor: colors.primary }]}
    >
      <ThemedText
        style={[styles.statLabel, accent && { color: "rgba(255,255,255,0.7)" }]}
      >
        {label}
      </ThemedText>
      <ThemedText
        style={[styles.statValue, accent && { color: colors.whiteSoft }]}
      >
        {value}
      </ThemedText>
    </View>
  );
}

function BillRow({
  bill,
  isCurrentUser,
  onPayPress,
  paying,
}: {
  bill: Bill;
  isCurrentUser: boolean;
  onPayPress: (bill: Bill) => void;
  paying: boolean;
}) {
  return (
    <View style={styles.billRow}>
      <Avatar name={bill.profileName || "?"} size={36} />
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.billName}>
          {bill.profileName || "Unknown"}
        </ThemedText>
        {bill.payByDate && (
          <ThemedText style={styles.billDate}>
            Due {formatDate(bill.payByDate)}
          </ThemedText>
        )}
      </View>
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        <ThemedText
          style={[styles.billAmount, bill.paid && { color: colors.success }]}
        >
          {formatCurrency(bill.amount)}
        </ThemedText>
        {bill.paid ? (
          <View style={styles.paidBadge}>
            <Ionicons name="checkmark" size={10} color={colors.success} />
            <ThemedText style={styles.paidText}>Paid</ThemedText>
          </View>
        ) : isCurrentUser ? (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => onPayPress(bill)}
            disabled={paying}
            activeOpacity={0.8}
          >
            {paying ? (
              <ActivityIndicator size="small" color={colors.whiteSoft} />
            ) : (
              <ThemedText style={styles.payButtonText}>Pay Now</ThemedText>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.pendingBadge}>
            <ThemedText style={styles.pendingText}>Pending</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

function ExpenseCard({
  expense,
  currentProfileId,
  onPayBill,
  payingBillId,
}: {
  expense: Expense;
  currentProfileId: number | undefined;
  onPayBill: (bill: Bill) => void;
  payingBillId: number | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const bills = expense.bills || [];

  // ✅ calculate per-person dollar amount from splitAmount percentage
  const perPersonAmount =
    expense.splitAmount > 0
      ? expense.amount * (expense.splitAmount / 100)
      : bills.length > 0
        ? expense.amount / bills.length
        : expense.amount;

  return (
    <View style={styles.expenseCard}>
      {/* ✅ TouchableOpacity is more reliable than Pressable for nested press */}
      <TouchableOpacity
        style={styles.expenseCardHeader}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.expenseIconWrap}>
          <Ionicons name="receipt-outline" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.expenseDescription}>
            {expense.description}
          </ThemedText>
          <ThemedText style={styles.expenseMeta}>
            {formatDate(expense.createdAt)}
            {expense.paidByDate
              ? ` · Due ${formatDate(expense.paidByDate)}`
              : ""}
          </ThemedText>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <ThemedText style={styles.expenseAmount}>
            {formatCurrency(expense.amount)}
          </ThemedText>
          <View
            style={[
              styles.statusBadge,
              expense.paid
                ? { backgroundColor: `${colors.success}20` }
                : { backgroundColor: `${colors.warning}30` },
            ]}
          >
            <ThemedText
              style={[
                styles.statusText,
                { color: expense.paid ? colors.success : colors.warning },
              ]}
            >
              {expense.paid ? "Settled" : "Pending"}
            </ThemedText>
          </View>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textMuted}
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {/* ✅ Bills breakdown — shows individual bills not household expense */}
      {expanded && (
        <View style={styles.billsList}>
          <View style={styles.divider} />
          {bills.length > 0 ? (
            <>
              <ThemedText style={styles.splitLabel}>
                Split {bills.length} ways · {formatCurrency(perPersonAmount)}{" "}
                each
              </ThemedText>
              {bills.map((bill) => (
                <BillRow
                  key={bill.billId}
                  bill={bill}
                  isCurrentUser={bill.profileId === currentProfileId}
                  onPayPress={onPayBill}
                  paying={payingBillId === bill.billId}
                />
              ))}
            </>
          ) : (
            <ThemedText style={styles.splitLabel}>No bills yet.</ThemedText>
          )}
        </View>
      )}
    </View>
  );
}

// ─── New Expense Modal ────────────────────────────────────────────────────────

function NewExpenseModal({
  visible,
  onClose,
  onSubmit,
  submitting,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    amount: string;
    paidByDate: string;
  }) => void;
  submitting: boolean;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidByDate, setPaidByDate] = useState("");

  function handleSubmit() {
    if (!description.trim() || !amount.trim()) return;
    onSubmit({ description, amount, paidByDate });
  }

  function handleClose() {
    setDescription("");
    setAmount("");
    setPaidByDate("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* ✅ justifyContent center so modal appears in middle of screen */}
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <ThemedText style={styles.modalTitle}>New Expense</ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            The cost will be split equally among all household members.
          </ThemedText>

          <View style={styles.modalFields}>
            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>Description</ThemedText>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g., Monthly Rent, Electricity..."
                placeholderTextColor={colors.textMuted}
                style={styles.fieldInput}
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>Total Amount</ThemedText>
              <View style={styles.amountInputWrap}>
                <ThemedText style={styles.currencySymbol}>$</ThemedText>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  style={[
                    styles.fieldInput,
                    { flex: 1, paddingLeft: 0, borderWidth: 0 },
                  ]}
                />
              </View>
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>
                Due Date{" "}
                <ThemedText style={{ color: colors.textMuted }}>
                  (optional)
                </ThemedText>
              </ThemedText>
              <TextInput
                value={paidByDate}
                onChangeText={setPaidByDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                style={styles.fieldInput}
              />
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!description.trim() || !amount.trim()) && { opacity: 0.5 },
              ]}
              onPress={handleSubmit}
              disabled={submitting || !description.trim() || !amount.trim()}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color={colors.whiteSoft} />
              ) : (
                <ThemedText style={styles.submitBtnText}>
                  Create Expense
                </ThemedText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Pay Modal ────────────────────────────────────────────────────────────────

function PayModal({
  bill,
  onClose,
  onMarkPaid,
  marking,
}: {
  bill: Bill | null;
  onClose: () => void;
  onMarkPaid: () => void;
  marking: boolean;
}) {
  if (!bill) return null;

  function openVenmo() {
    const venmoUrl = `venmo://paycharge?txn=pay&amount=${bill!.amount.toFixed(
      2,
    )}&note=${encodeURIComponent(bill!.description)}`;
    Linking.openURL(venmoUrl).catch(() => {
      Linking.openURL("https://venmo.com");
    });
  }

  return (
    <Modal visible={!!bill} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { gap: 16 }]}>
          <View style={styles.modalHandle} />
          <ThemedText style={styles.modalTitle}>Pay Your Share</ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            {bill.description}
          </ThemedText>

          <View style={styles.payAmountBox}>
            <ThemedText style={styles.payAmountLabel}>Your share</ThemedText>
            <ThemedText style={styles.payAmountValue}>
              {formatCurrency(bill.amount)}
            </ThemedText>
            {bill.payByDate && (
              <ThemedText style={styles.payAmountDue}>
                Due {formatDate(bill.payByDate)}
              </ThemedText>
            )}
          </View>

          <TouchableOpacity
            style={styles.venmoBtn}
            onPress={openVenmo}
            activeOpacity={0.85}
          >
            <ThemedText style={styles.venmoBtnText}>Open in Venmo</ThemedText>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.markPaidBtn}
            onPress={onMarkPaid}
            disabled={marking}
            activeOpacity={0.85}
          >
            {marking ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={colors.primary}
                />
                <ThemedText style={styles.markPaidText}>
                  Mark as Paid Manually
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExpensesPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const { profile } = useAuthContext();

  const currentProfileId = profile?.profileId;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [myBills, setMyBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [payingBillId, setPayingBillId] = useState<number | null>(null);
  const [markingPaid, setMarkingPaid] = useState(false);

  async function loadData() {
    if (!householdId || !currentProfileId) return;
    try {
      setLoading(true);
      const [expensesData, billsData] = await Promise.all([
        getExpensesWithBillsByHousehold(Number(householdId)),
        getBillsByProfileAndHousehold(currentProfileId, Number(householdId)),
      ]);

      // ✅ handle both array and wrapped object responses
      const expensesList = Array.isArray(expensesData)
        ? expensesData
        : expensesData?.expenses || [];
      const billsList = Array.isArray(billsData)
        ? billsData
        : billsData?.bills || [];

      setExpenses(expensesList);
      setMyBills(billsList);
    } catch (e) {
      console.error("Failed to load expenses", e);
      setExpenses([]);
      setMyBills([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!profile?.profileId || !householdId) return;
    loadData();
  }, [householdId, profile?.profileId]);

  async function handleCreateExpense(data: {
    description: string;
    amount: string;
    paidByDate: string;
  }) {
    if (!householdId) return;
    try {
      setSubmitting(true);
      await createExpense({
        householdId: Number(householdId),
        description: data.description,
        amount: parseFloat(data.amount),
        paidByDate: data.paidByDate
          ? new Date(data.paidByDate).toISOString()
          : undefined,
      });
      setShowNewExpense(false);
      await loadData();
    } catch (e) {
      console.error("Failed to create expense", e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkBillPaid() {
    if (!selectedBill) return;
    try {
      setMarkingPaid(true);
      setPayingBillId(selectedBill.billId);
      await markBillPaid(selectedBill.billId);
      setSelectedBill(null);
      await loadData();
    } catch (e) {
      console.error("Failed to mark bill paid", e);
    } finally {
      setMarkingPaid(false);
      setPayingBillId(null);
    }
  }

  // ✅ guard against null/undefined in reduce
  const totalThisMonth = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const myUnpaidBills = myBills.filter((b) => !b.paid);
  const myShare = myUnpaidBills.reduce((sum, b) => sum + (b.amount || 0), 0);
  const unpaidCount = myUnpaidBills.length;

  const handleNavigation = (id: string) => {
    const routes: Record<string, string> = {
      activity: `/households/${householdId}/(tabs)`,
      chores: `/households/${householdId}/(tabs)/chores`,
      expenses: `/households/${householdId}/(tabs)/expenses`,
      groceries: `/households/${householdId}/(tabs)/groceries`,
      chat: `/households/${householdId}/(tabs)/chat`,
      settings: `/households/${householdId}/(tabs)/settings`,
    };
    if (routes[id]) router.push(routes[id] as any);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: colors.background,
      }}
    >
      {!isMobile && (
        <Sidebar
          items={[
            { id: "activity", label: "Activity", icon: "list" },
            { id: "chores", label: "Chores", icon: "checkbox" },
            {
              id: "expenses",
              label: "Expenses",
              icon: "receipt",
              active: true,
            },
            { id: "groceries", label: "Groceries", icon: "cart" },
            { id: "household", label: "My Household", icon: "home" },
          ]}
          householdId={householdId}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{ flex: 1, padding: 24, backgroundColor: colors.background }}
        >
          <View style={styles.pageHeader}>
            <View>
              <ThemedText style={styles.pageTitle}>Shared Costs</ThemedText>
              <ThemedText style={styles.pageSubtitle}>
                Maintaining balance in the household, one receipt at a time.
              </ThemedText>
            </View>
            <TouchableOpacity
              style={styles.newEntryBtn}
              onPress={() => setShowNewExpense(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color={colors.whiteSoft} />
              <ThemedText style={styles.newEntryText}>New Entry</ThemedText>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : (
            <>
              <View style={styles.statsRow}>
                <StatCard
                  label="Total This Month"
                  value={formatCurrency(totalThisMonth)}
                />
                <StatCard
                  label="Your Share"
                  value={formatCurrency(myShare)}
                  accent
                />
                <StatCard label="Unpaid Bills" value={unpaidCount.toString()} />
              </View>

              {myUnpaidBills.length > 0 && (
                <View style={styles.section}>
                  <SectionHeader title="Your Pending Bills" />
                  <View style={styles.card}>
                    {myUnpaidBills.map((bill, idx) => (
                      <View key={bill.billId}>
                        {idx > 0 && <View style={styles.divider} />}
                        <View style={styles.myBillRow}>
                          <View style={{ flex: 1 }}>
                            <ThemedText style={styles.myBillDescription}>
                              {bill.description}
                            </ThemedText>
                            {bill.payByDate && (
                              <ThemedText style={styles.myBillDate}>
                                Due {formatDate(bill.payByDate)}
                              </ThemedText>
                            )}
                          </View>
                          <View style={{ alignItems: "flex-end", gap: 6 }}>
                            <ThemedText style={styles.myBillAmount}>
                              {formatCurrency(bill.amount)}
                            </ThemedText>
                            <TouchableOpacity
                              style={styles.payButton}
                              onPress={() => setSelectedBill(bill)}
                              activeOpacity={0.8}
                            >
                              <ThemedText style={styles.payButtonText}>
                                Pay Now
                              </ThemedText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <SectionHeader title="Recent Ledger" />
                {expenses.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="receipt-outline"
                      size={40}
                      color={colors.borderSoft}
                    />
                    <ThemedText style={styles.emptyText}>
                      No expenses yet. Add your first one!
                    </ThemedText>
                  </View>
                ) : (
                  <View style={{ gap: 10 }}>
                    {expenses.map((expense) => (
                      <ExpenseCard
                        key={expense.expenseId}
                        expense={expense}
                        currentProfileId={currentProfileId}
                        onPayBill={setSelectedBill}
                        payingBillId={payingBillId}
                      />
                    ))}
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>

      {isMobile && (
        <BottomNavigation
          items={[
            { id: "activity", label: "Activity", icon: "list" },
            { id: "chores", label: "Chores", icon: "checkbox" },
            {
              id: "expenses",
              label: "Expenses",
              icon: "receipt",
              active: true,
            },
            { id: "groceries", label: "Groceries", icon: "cart" },
          ]}
          householdId={householdId}
          onItemPress={handleNavigation}
        />
      )}

      <NewExpenseModal
        visible={showNewExpense}
        onClose={() => setShowNewExpense(false)}
        onSubmit={handleCreateExpense}
        submitting={submitting}
      />

      <PayModal
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
        onMarkPaid={handleMarkBillPaid}
        marking={markingPaid}
      />
      {!isMobile && <RightPanel />}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    gap: 24,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    maxWidth: 280,
  },
  newEntryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  newEntryText: {
    color: colors.whiteSoft,
    fontWeight: "800",
    fontSize: 14,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  section: {
    gap: 0,
  },
  card: {
    backgroundColor: colors.whiteSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: "hidden",
  },
  myBillRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  myBillDescription: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  myBillDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  myBillAmount: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginHorizontal: 16,
  },
  expenseCard: {
    backgroundColor: colors.whiteSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: "hidden",
  },
  expenseCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  expenseIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  expenseDescription: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  expenseMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  billsList: {
    gap: 0,
  },
  splitLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  billRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  billName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  billDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  billAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: `${colors.success}20`,
  },
  paidText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.success,
  },
  pendingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: `${colors.warning}30`,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.warning,
  },
  payButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  payButtonText: {
    color: colors.whiteSoft,
    fontSize: 12,
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
    backgroundColor: colors.whiteSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },

  // ✅ Modal centered
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 24,
    paddingBottom: 32,
    gap: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft,
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: -12,
  },
  modalFields: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  fieldInput: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  amountInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSoft,
    borderRadius: 14,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginRight: 4,
  },
  modalActions: {
    gap: 12,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    padding: 18,
    alignItems: "center",
  },
  submitBtnText: {
    color: colors.whiteSoft,
    fontSize: 16,
    fontWeight: "900",
  },
  cancelBtn: {
    borderRadius: 999,
    padding: 14,
    alignItems: "center",
  },
  cancelBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  payAmountBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  payAmountLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  payAmountValue: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.text,
  },
  payAmountDue: {
    fontSize: 13,
    color: colors.textMuted,
  },
  venmoBtn: {
    backgroundColor: colors.dark,
    borderRadius: 999,
    padding: 18,
    alignItems: "center",
  },
  venmoBtnText: {
    color: colors.whiteSoft,
    fontSize: 16,
    fontWeight: "900",
  },
  markPaidBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 16,
  },
  markPaidText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
});
