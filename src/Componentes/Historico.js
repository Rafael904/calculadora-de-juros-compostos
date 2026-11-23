function Historico({ historico, onSelecionar, onLimpar }) {
    return (
        <div>
            <h2>Histórico de cálculos</h2>
            <button type="button" onClick={onLimpar}>Limpar histórico</button>
            <br/><br/><ul>
                {historico.map(({ inicial, mensal, juros, periodo }, index) => (
                    <li key={index}>
                        <button
                            type="button"
                            className="historico-item"
                            onClick={() => onSelecionar({ inicial, mensal, juros, periodo })}
                        >
                            {index + 1}. VI: R${inicial}, IM: R${mensal}, TJ: {juros}%, PA: {periodo} anos
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Historico;