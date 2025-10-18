import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewCardDialog from "@/pages/board/components/createCard";
import Board from "@/pages/board";
import { render } from "@/tests/utils/render";

function App() {
  return (
    <main>
      <NewCardDialog />
      <Board />
    </main>
  );
}

describe("New Task", () => {
  test("Workflow to create new task", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: /new task/i }));
    await userEvent.type(screen.getByLabelText(/title/i), "Card test");
    await userEvent.type(screen.getByLabelText(/description/i), "Details X");
    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(await screen.findByText("Card test")).toBeInTheDocument();

    await waitFor(() => {
      const badges = screen.queryAllByText(/saving/i);

      if (badges.length) {
        expect(badges.length).toBe(0);
      }
    });
  });
});
