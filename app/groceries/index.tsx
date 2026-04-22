import BottomNav from "@/components/ui/BottomNav";

export default function Groceries() {
  return (
    <BottomNav activeItem="Groceries" onSelect={(item) => console.log('Selected:', item)} />
  );
}