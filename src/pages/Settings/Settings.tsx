import React, { ReactElement, useState } from 'react';
import { classTypeMap } from '../../hashes';
import {
  ArmorScoring,
  getDefaultHunterScoring,
  getDefaultTitanScoring,
  getDefaultWarlockScoring,
} from '../../scoring/scoring';
import ScoringStorage from '../../storage/Scoring';
import './settings.scss';

function Settings(): ReactElement {
  const scoringStorage = ScoringStorage.getInstance();
  const storedScoring = scoringStorage.getScoring();
  const initialScoring = storedScoring
    ? {
        0: new ArmorScoring(storedScoring[0]),
        1: new ArmorScoring(storedScoring[1]),
        2: new ArmorScoring(storedScoring[2]),
      }
    : {
        0: getDefaultTitanScoring(),
        1: getDefaultHunterScoring(),
        2: getDefaultWarlockScoring(),
      };

  const [settings, setSettings] = useState<{ [key: number]: ArmorScoring }>(initialScoring);

  const classes = Object.keys(classTypeMap);
  const statKeys = ['Mobility', 'Resilience', 'Recovery', 'Discipline', 'Intellect', 'Strength'];

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    scoringStorage.setScoring(JSON.stringify(settings));
    return;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const [classType, stat] = name.split('-');

    const characterSetting = settings[parseInt(classType)];
    if (stat === 'Mobility') characterSetting.Mobility = parseInt(value);
    if (stat === 'Resilience') characterSetting.Resilience = parseInt(value);
    if (stat === 'Recovery') characterSetting.Recovery = parseInt(value);
    if (stat === 'Discipline') characterSetting.Discipline = parseInt(value);
    if (stat === 'Intellect') characterSetting.Intellect = parseInt(value);
    if (stat === 'Strength') characterSetting.Strength = parseInt(value);

    setSettings({ ...settings, [parseInt(classType)]: characterSetting });
    console.log(`changing ${name} to ${value}`);
  }

  return (
    <>
      <h2>Scoring Settings</h2>
      <p>
        Configure your own scoring here. This will affect the scores you see on the main page. For example, if you only
        value <code>Recovery</code> on armor, you would set the <code>Recovery</code> field for your classes below to a
        number. The score you would see for vendor armor would be: (<code>Recovery * number</code>)
      </p>
      <form onSubmit={handleSubmit}>
        <div className="settings">
          {classes.map((classType) => (
            <div className="characterSettings" key={classType}>
              <h3>{classTypeMap[classType]}</h3>
              <label>
                Mobility:{' '}
                <input
                  type="number"
                  name={`${classType}-Mobility`}
                  onChange={handleInputChange}
                  value={settings[parseInt(classType)].Mobility}
                  className="statInput"
                />{' '}
              </label>
              <label>
                Resilience:{' '}
                <input
                  type="number"
                  name={`${classType}-Resilience`}
                  onChange={handleInputChange}
                  value={settings[parseInt(classType)].Resilience}
                  className="statInput"
                />{' '}
              </label>
              <label>
                Recovery:{' '}
                <input
                  type="number"
                  name={`${classType}-Recovery`}
                  onChange={handleInputChange}
                  value={settings[parseInt(classType)].Recovery}
                  className="statInput"
                />{' '}
              </label>
              <label>
                Discipline:{' '}
                <input
                  type="number"
                  name={`${classType}-Discipline`}
                  onChange={handleInputChange}
                  value={settings[parseInt(classType)].Discipline}
                  className="statInput"
                />{' '}
              </label>
              <label>
                Intellect:{' '}
                <input
                  type="number"
                  name={`${classType}-Intellect`}
                  onChange={handleInputChange}
                  value={settings[parseInt(classType)].Intellect}
                  className="statInput"
                />{' '}
              </label>
              <label>
                Strength:{' '}
                <input
                  type="number"
                  name={`${classType}-Strength`}
                  onChange={handleInputChange}
                  value={settings[parseInt(classType)].Strength}
                  className="statInput"
                />{' '}
              </label>
            </div>
          ))}

          {/* <div className="characterSettings">
            <h3>Hunter</h3>
            <label>
              Mobility: <input type="number" name="1-Mobility" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Resilience: <input type="number" name="1-Resilience" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Recovery: <input type="number" name="1-Recovery" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Discipline: <input type="number" name="1-Discipline" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Intellect: <input type="number" name="1-Intellect" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Strength: <input type="number" name="1-Strength" onChange={handleInputChange} />{' '}
            </label>
          </div>

          <div className="characterSettings">
            <h3>Warlock</h3>
            <label>
              Mobility: <input type="number" name="2-Mobility" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Resilience: <input type="number" name="2-Resilience" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Recovery: <input type="number" name="2-Recovery" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Discipline: <input type="number" name="2-Discipline" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Intellect: <input type="number" name="2-Intellect" onChange={handleInputChange} />{' '}
            </label>
            <label>
              Strength: <input type="number" name="2-Strength" onChange={handleInputChange} />{' '}
            </label>
          </div> */}
        </div>
        <input type="submit" value="Save Changes" onChange={handleInputChange} />
      </form>
    </>
  );
}

export default Settings;
