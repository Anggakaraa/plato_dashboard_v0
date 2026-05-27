interface Entry {
    anode: string;
    cathode: string;
    type: string;
    color: string;
}

const dictionary: Entry[] = [
    { anode: 'R', cathode: 'L', type: 'create', color: '#0a808a' },
    { anode: 'L', cathode: 'R', type: 'learn', color: '#ffba60' },
    { anode: 'B', cathode: 'L', type: 'rethink', color: '#1d8057' },
    { anode: 'L', cathode: 'B', type: 'concentrate', color: '#c80700' },
    { anode: 'R', cathode: 'B', type: 'clarity', color: '#93278F' },
    { anode: 'B', cathode: 'R', type: 'calm', color: '#9E005D' },
    { anode: 'B', cathode: 'B', type: 'default', color: '#808080' },
    { anode: '', cathode: '', type: 'default', color: '#808080' }
];

class StimulationParameterHandler {
    private entries: Entry[];

    constructor() {
        this.entries = dictionary;
    }

    addEntry(anode: string, cathode: string, type: string, color: string): void {
        const entry: Entry = { anode, cathode, type, color };
        this.entries.push(entry);
    }

    findTypeAndColor(anode: string, cathode: string): { type: string; color: string } | undefined {
        const entry = this.entries.find(entry => entry.anode === anode && entry.cathode === cathode);
        if (entry) {
            return { type: entry.type, color: entry.color };
        }
        return undefined;
    }
}

// Example usage:
export const StimualtionDictionary = new StimulationParameterHandler();

// Find type and color by anode and cathode:
//console.log(tableHandler.findTypeAndColor('R', 'L')); // { type: 'create', color: '#a0888a' }
