import NewCardModal from "@/pages/board/components/createCard";
import Board from "@/pages/board";
import FiltersBar from "@/pages/board/components/filterBar";

export default function Home() {
  return (
    <main className="p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Board</h1>
        <NewCardModal />
      </div>
      <FiltersBar />
      <Board />
    </main>
  );
}
