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

describe("Nueva tarjeta", () => {
  test("crea una tarjeta y se ve en Backlog", async () => {
    render(<App />);

    await userEvent.click(
      screen.getByRole("button", { name: /nueva tarjeta/i })
    );
    await userEvent.type(screen.getByLabelText(/título/i), "Tarjeta de prueba");
    await userEvent.type(screen.getByLabelText(/descripción/i), "Detalle X");
    await userEvent.click(screen.getByRole("button", { name: /crear/i }));

    expect(await screen.findByText("Tarjeta de prueba")).toBeInTheDocument();

    await waitFor(() => {
      const badges = screen.queryAllByText(/guardando/i);

      if (badges.length) {
        expect(badges.length).toBe(0);
      }
    });
  });
});
