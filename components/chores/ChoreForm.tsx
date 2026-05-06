import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { Calendar, Clock, Plus } from "lucide-react-native";
import { useState } from "react";
import { createChore } from "@/api/chores";
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

type ChoreFormProps = {
  householdId: string;
  onSuccess: () => void;
  onCancel?: () => void;
};

const users = [
  { id: "1", name: "Julian", initials: "JD", color: colors.surfaceSoft },
  { id: "2", name: "Sarah (Me)", initials: "ME", color: colors.secondary },
  { id: "3", name: "Marcus", initials: "ML", color: colors.borderSoft },
];

export default function ChoreForm({
  householdId,
  onSuccess,
  onCancel,
}: ChoreFormProps) {
  const [selectedUser, setSelectedUser] = useState("2");

  // CHANGE: added state for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // CHANGE: submit handler
  async function handleSubmit() {
    if (!title.trim()) {
      console.error("Chore name is required");
      return;
    }

    try {
      setSubmitting(true);

      const completeBy = dueDate
        ? new Date(
            `${dueDate}T${preferredTime || "00:00"}:00`
          ).toISOString()
        : null;

      await createChore({
        choreName: title,
        choreDescription: description,
        repeatInterval: 0,
        isCompleted: false,
        completeBy,
        profileId: Number(selectedUser),
        householdId: Number(householdId),
      });

      onSuccess();
    } catch (err) {
      console.error("Failed to create chore", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.form}>
      {/* Chore Name */}
      <View style={styles.field}>
        <ThemedText style={styles.label}>Chore Name</ThemedText>
        <TextInput
          placeholder="e.g., Deep Clean Living Room"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description */}
      <View style={styles.field}>
        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          placeholder="Share specific details or expectations..."
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Date + Time */}
      <View style={styles.row}>
        <View style={[styles.field, styles.rowField]}>
          <ThemedText style={styles.label}>Complete By Date</ThemedText>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              style={styles.inputWithIcon}
              value={dueDate}
              onChangeText={setDueDate}
            />
            <Calendar size={20} color={colors.textMuted} />
          </View>
        </View>

        <View style={[styles.field, styles.rowField]}>
          <ThemedText style={styles.label}>Preferred Time</ThemedText>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="HH:MM"
              placeholderTextColor={colors.textMuted}
              style={styles.inputWithIcon}
              value={preferredTime}
              onChangeText={setPreferredTime}
            />
            <Clock size={20} color={colors.textMuted} />
          </View>
        </View>
      </View>

      {/* Assign To */}
      <View style={styles.field}>
        <ThemedText style={styles.label}>Assign To</ThemedText>

        <View style={styles.userWrap}>
          {users.map((user) => {
            const selected = selectedUser === user.id;

            return (
              <Pressable
                key={user.id}
                onPress={() => setSelectedUser(user.id)}
                style={[
                  styles.userButton,
                  selected && styles.userButtonSelected,
                ]}
              >
                <View
                  style={[
                    styles.initialsCircle,
                    {
                      backgroundColor: selected
                        ? colors.whiteSoft
                        : user.color,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.initials,
                      selected && { color: colors.primary },
                    ]}
                  >
                    {user.initials}
                  </ThemedText>
                </View>

                <ThemedText
                  style={[
                    styles.userName,
                    selected && styles.selectedText,
                  ]}
                >
                  {user.name}
                </ThemedText>
              </Pressable>
            );
          })}

          <Pressable style={styles.everyoneButton}>
            <Plus size={16} color={colors.textMuted} />
            <ThemedText style={styles.everyoneText}>Everyone</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* CHANGE: submit button now calls handleSubmit */}
        <Pressable
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <ThemedText style={styles.submitText}>
            {submitting ? "Creating..." : "Create Chore"}
          </ThemedText>
        </Pressable>

        {/* CHANGE: Go Back can now close modal */}
        <Pressable style={styles.backButton} onPress={onCancel}>
          <ThemedText style={styles.backText}>Go Back</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

// export default function TaskForm() {
//   const [selectedUser, setSelectedUser] = useState("2");

//   return (
//     <View style={styles.form}>
//       {/* Chore Name */}
//       <View style={styles.field}>
//         <ThemedText style={styles.label}>Chore Name</ThemedText>
//         <TextInput
//           placeholder="e.g., Deep Clean Living Room"
//           placeholderTextColor={colors.textMuted}
//           style={styles.input}
//         />
//       </View>

//       {/* Description */}
//       <View style={styles.field}>
//         <ThemedText style={styles.label}>Description</ThemedText>
//         <TextInput
//           placeholder="Share specific details or expectations..."
//           placeholderTextColor={colors.textMuted}
//           style={[styles.input, styles.textArea]}
//           multiline
//           numberOfLines={4}
//           textAlignVertical="top"
//         />
//       </View>

//       {/* Date + Time */}
//       <View style={styles.row}>
//         <View style={[styles.field, styles.rowField]}>
//           <ThemedText style={styles.label}>Complete By Date</ThemedText>
//           <View style={styles.inputWrapper}>
//             <TextInput
//               placeholder="YYYY-MM-DD"
//               placeholderTextColor={colors.textMuted}
//               style={styles.inputWithIcon}
//             />
//             <Calendar size={20} color={colors.textMuted} />
//           </View>
//         </View>

//         <View style={[styles.field, styles.rowField]}>
//           <ThemedText style={styles.label}>Preferred Time</ThemedText>
//           <View style={styles.inputWrapper}>
//             <TextInput
//               placeholder="HH:MM"
//               placeholderTextColor={colors.textMuted}
//               style={styles.inputWithIcon}
//             />
//             <Clock size={20} color={colors.textMuted} />
//           </View>
//         </View>
//       </View>

//       {/* Assign To */}
//       <View style={styles.field}>
//         <ThemedText style={styles.label}>Assign To</ThemedText>

//         <View style={styles.userWrap}>
//           {users.map((user) => {
//             const selected = selectedUser === user.id;

//             return (
//               <Pressable
//                 key={user.id}
//                 onPress={() => setSelectedUser(user.id)}
//                 style={[
//                   styles.userButton,
//                   selected && styles.userButtonSelected,
//                 ]}
//               >
//                 <View
//                   style={[
//                     styles.initialsCircle,
//                     {
//                       backgroundColor: selected
//                         ? colors.whiteSoft
//                         : user.color,
//                     },
//                   ]}
//                 >
//                   <ThemedText
//                     style={[
//                       styles.initials,
//                       selected && { color: colors.primary },
//                     ]}
//                   >
//                     {user.initials}
//                   </ThemedText>
//                 </View>

//                 <ThemedText
//                   style={[
//                     styles.userName,
//                     selected && styles.selectedText,
//                   ]}
//                 >
//                   {user.name}
//                 </ThemedText>
//               </Pressable>
//             );
//           })}

//           <Pressable style={styles.everyoneButton}>
//             <Plus size={16} color={colors.textMuted} />
//             <ThemedText style={styles.everyoneText}>Everyone</ThemedText>
//           </Pressable>
//         </View>
//       </View>

//       {/* Actions */}
//       <View style={styles.actions}>
//         <Pressable style={styles.submitButton}>
//           <ThemedText style={styles.submitText}>Create Chore</ThemedText>
//         </Pressable>

//         <Pressable style={styles.backButton}>
//           <ThemedText style={styles.backText}>Go Back</ThemedText>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  form: {
    gap: 28,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  input: {
    borderRadius: 14,
    padding: 16,
    backgroundColor: colors.surfaceSoft,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  rowField: {
    flex: 1,
    minWidth: 220,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceSoft,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
  },
  userWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.whiteSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  userButtonSelected: {
    backgroundColor: colors.primary,
  },
  initialsCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.text,
  },
  selectedText: {
    color: colors.whiteSoft,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  everyoneButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
  },
  everyoneText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMuted,
  },
  actions: {
    paddingTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  submitButton: {
    paddingHorizontal: 34,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  submitText: {
    color: colors.whiteSoft,
    fontSize: 17,
    fontWeight: "900",
  },
  backButton: {
    paddingHorizontal: 34,
    paddingVertical: 16,
    borderRadius: 999,
  },
  backText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "900",
  },
});