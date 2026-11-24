import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { UserProvider } from './VarContext/Context';

// Isola cada teste para que dados salvos anteriormente não interfiram.
beforeEach(() => {
  window.localStorage.clear();
});

test('mantém o histórico após reabrir e restaura os valores ao selecionar um item', () => {
  const { unmount } = render(
    <UserProvider>
      <App />
    </UserProvider>
  );

  // Preenche os dados e salva uma nova simulação no histórico.
  const campos = screen.getAllByRole('spinbutton');
  fireEvent.change(campos[0], { target: { value: '1000' } });
  fireEvent.change(campos[1], { target: { value: '200' } });
  fireEvent.change(campos[2], { target: { value: '5' } });
  fireEvent.change(campos[3], { target: { value: '10' } });
  fireEvent.click(screen.getByRole('button', { name: /calcular/i }));

  // Desmontar e renderizar novamente simula fechar e reabrir a aplicação.
  unmount();
  render(
    <UserProvider>
      <App />
    </UserProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /VI: R\$1000, IM: R\$200, TJ: 5%, PA: 10 anos/i }));

  // Selecionar o histórico deve restaurar os valores nos campos.
  const camposReabertos = screen.getAllByRole('spinbutton');
  expect(camposReabertos[0]).toHaveValue(1000);
  expect(camposReabertos[1]).toHaveValue(200);
  expect(camposReabertos[2]).toHaveValue(5);
  expect(camposReabertos[3]).toHaveValue(10);
});

test('limpa o histórico da tela e do armazenamento local', () => {
  render(
    <UserProvider>
      <App />
    </UserProvider>
  );

  const campos = screen.getAllByRole('spinbutton');
  fireEvent.change(campos[0], { target: { value: '1000' } });
  fireEvent.click(screen.getByRole('button', { name: /calcular/i }));
  fireEvent.click(screen.getByRole('button', { name: /limpar histórico/i }));

  // Confirma que a limpeza atualiza a interface e o armazenamento persistente.
  expect(screen.queryByRole('button', { name: /VI: R\$1000/i })).not.toBeInTheDocument();
  expect(window.localStorage.getItem('historico-calculadora')).toBe('[]');
});
