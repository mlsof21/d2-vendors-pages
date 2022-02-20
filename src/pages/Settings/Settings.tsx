import React, { useState } from 'react';
import { classTypeMap, orderedClassKeys, statHashes } from '../../hashes';
import {
  getDefaultHunterScoring,
  getDefaultScoring,
  getDefaultTitanScoring,
  getDefaultWarlockScoring,
} from '../../scoring/scoring';
import ScoringStorage, { Scoring } from '../../storage/ScoringStorage';
import './settings.scss';

const Settings = () => {
  const scoringStorage = ScoringStorage.getInstance();
  const storedScoring = scoringStorage.getScoring();
  const initialScoring = storedScoring
    ? {
        0: storedScoring[0],
        1: storedScoring[1],
        2: storedScoring[2],
      }
    : {
        0: getDefaultTitanScoring(),
        1: getDefaultHunterScoring(),
        2: getDefaultWarlockScoring(),
      };

  const [settings, setSettings] = useState<Scoring>(initialScoring);
  const [saveButtonText, setSaveButtonText] = useState('Save Changes');

  const classes = [...orderedClassKeys];

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    scoringStorage.setScoring(settings);

    setSaveButtonText('Saved!');
    setTimeout(() => setSaveButtonText('Save Changes'), 2000);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const [classType, stat] = name.split('-');

    const characterSetting = settings[parseInt(classType)];
    characterSetting[parseInt(stat)] = parseInt(value);

    setSettings({ ...settings, [parseInt(classType)]: characterSetting });
    console.log(`changing ${name} to ${value}`);
  }

  function handleResetClick() {
    setSettings({
      0: getDefaultScoring(),
      1: getDefaultScoring(),
      2: getDefaultScoring(),
    });
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
              {Object.keys(statHashes)
                .map((x) => parseInt(x))
                .map((stat) => (
                  <label key={stat}>
                    {statHashes[stat]}:
                    <input
                      type="number"
                      name={`${classType}-${stat}`}
                      onChange={handleInputChange}
                      value={settings[classType][stat]}
                      className="statInput"
                      min="0"
                    />{' '}
                  </label>
                ))}
              {/* <label>
                Mobility:{' '}
                <input
                  type="number"
                  name={`${classType}-Mobility`}
                  onChange={handleInputChange}
                  value={settings[classType].Mobility}
                  className="statInput"
                  min="0"
                />{' '}
              </label>
              <label>
                Resilience:{' '}
                <input
                  type="number"
                  name={`${classType}-Resilience`}
                  onChange={handleInputChange}
                  value={settings[classType].Resilience}
                  className="statInput"
                  min="0"
                />{' '}
              </label>
              <label>
                Recovery:{' '}
                <input
                  type="number"
                  name={`${classType}-Recovery`}
                  onChange={handleInputChange}
                  value={settings[classType].Recovery}
                  className="statInput"
                  min="0"
                />{' '}
              </label>
              <label>
                Discipline:{' '}
                <input
                  type="number"
                  name={`${classType}-Discipline`}
                  onChange={handleInputChange}
                  value={settings[classType].Discipline}
                  className="statInput"
                  min="0"
                />{' '}
              </label>
              <label>
                Intellect:{' '}
                <input
                  type="number"
                  name={`${classType}-Intellect`}
                  onChange={handleInputChange}
                  value={settings[classType].Intellect}
                  className="statInput"
                  min="0"
                />{' '}
              </label>
              <label>
                Strength:{' '}
                <input
                  type="number"
                  name={`${classType}-Strength`}
                  onChange={handleInputChange}
                  value={settings[classType].Strength}
                  className="statInput"
                  min="0"
                />{' '}
              </label> */}
            </div>
          ))}
        </div>
        <input type="button" value="Clear Scoring" onClick={handleResetClick} />
        <input type="submit" value={saveButtonText} onChange={handleInputChange} />
      </form>
    </>
  );
};

export default Settings;
