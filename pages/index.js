import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState({
    rollPrice: 6.95,
    initialCutoff: 30,
    newCutoff: 3,
    rollLength: 990,
    fullDiameter: 25.6,
    coreDiameter: 8.4,
    machines: 9,
    rollsPerMachine: 3.5,
    changeoverTime: 1,
  });

  const [results, setResults] = useState(null);

  const calculate = () => {
    const percentUsed = (cutoffMM) => {
      const cutoffCM = cutoffMM / 10;
      const outerDiameter = input.coreDiameter + 2 * cutoffCM;
      const usedVolume = Math.pow(outerDiameter, 2) - Math.pow(input.coreDiameter, 2);
      const totalVolume = Math.pow(input.fullDiameter, 2) - Math.pow(input.coreDiameter, 2);
      return usedVolume / totalVolume;
    };

    const usedPctInitial = percentUsed(input.initialCutoff);
    const usedPctNew = percentUsed(input.newCutoff);

    const totalRollsInitial = input.machines * input.rollsPerMachine;
    const rollsPerMachineNew = input.rollsPerMachine * (usedPctInitial / usedPctNew);
    const totalRollsNew = input.machines * rollsPerMachineNew;

    const downtimeSaved = (totalRollsInitial - totalRollsNew) * input.changeoverTime;
    const savingsPerRoll = input.rollPrice * (usedPctNew - usedPctInitial);

    setResults({
      savingsPerRoll: savingsPerRoll.toFixed(2),
      rollsUsedBefore: totalRollsInitial.toFixed(1),
      rollsUsedAfter: totalRollsNew.toFixed(1),
      downtimeSaved: downtimeSaved.toFixed(1),
    });
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: parseFloat(e.target.value) });
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h1>Tape Roll Savings Calculator</h1>
      {[
        { label: "Roll price (€)", name: "rollPrice" },
        { label: "Initial cutoff (mm)", name: "initialCutoff" },
        { label: "New cutoff (mm)", name: "newCutoff" },
        { label: "Roll length (m)", name: "rollLength" },
        { label: "Full roll diameter (cm)", name: "fullDiameter" },
        { label: "Core diameter (cm)", name: "coreDiameter" },
        { label: "Machines in use", name: "machines" },
        { label: "Rolls per machine per day", name: "rollsPerMachine" },
        { label: "Changeover time (min)", name: "changeoverTime" },
      ].map((field) => (
        <div key={field.name} style={{ marginBottom: 10 }}>
          <label>{field.label}</label>
          <input
            type="number"
            step="any"
            name={field.name}
            value={input[field.name]}
            onChange={handleChange}
            style={{ width: "100%", padding: "5px", marginTop: "5px" }}
          />
        </div>
      ))}
      <button onClick={calculate} style={{ padding: "10px 20px", marginTop: 10 }}>
        Calculate
      </button>

      {results && (
        <div style={{ marginTop: 20 }}>
          <p><strong>💰 Savings per roll:</strong> €{results.savingsPerRoll}</p>
          <p><strong>📦 Rolls used before:</strong> {results.rollsUsedBefore} / day</p>
          <p><strong>📉 Rolls used after:</strong> {results.rollsUsedAfter} / day</p>
          <p><strong>⏱️ Downtime saved:</strong> {results.downtimeSaved} minutes / day</p>
        </div>
      )}
    </div>
  );
}
