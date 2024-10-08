import scribble from 'scribbletune';
import MidiWriter from 'midi-writer-js';
import fs from 'fs';

// Define each chord manually using notes
const chords = [
    ['C3', 'E3', 'G3'],    // Cm
    ['G3', 'B3', 'D4'],    // G
    ['A3', 'C4', 'E4'],    // Am
    ['E3', 'G3', 'B3'],    // Em
    ['D3', 'F#3', 'A3'],   // D
    ['F3', 'Ab3', 'C4'],   // Fm
    ['B2', 'D#3', 'F#3'],  // B
    ['G2', 'Bb2', 'D3'],   // Gm
    ['D3', 'F3', 'A3']     // Dm
];

// Create an array to hold the MIDI track events
const track = [];

// Iterate over the chords and generate notes
chords.forEach(chordNotes => {
    try {
        // Create MIDI note events for each note in the chord
        track.push(...chordNotes.map(note => new MidiWriter.NoteEvent({
            pitch: note.toUpperCase(), // Uppercase to indicate the note (e.g., C3)
            duration: '1' // Quarter note duration
        })));

        // Add a slight delay between chords to distinguish them
        track.push(new MidiWriter.NoteEvent({
            pitch: chordNotes[0], // Adding a silent note to create spacing
            duration: '1',
            velocity: 0
        }));
    } catch (error) {
        console.error(`Error processing chord "${chordNotes}": ${error.message}`);
    }
});

// Create a new track and add events
const midiTrack = new MidiWriter.Track();
midiTrack.addEvent(track, function(event, index) {
    return { sequential: true };
});

// Create a MIDI file with the manually defined chord progression
try {
    console.log('Attempting to save MIDI file...');
    const write = new MidiWriter.Writer([midiTrack]);
    const midiData = write.buildFile(); // Build the binary MIDI data
    const outputPath = './chains_that_bind_us_chords.mid'; // Specify the output path

    // Save the binary data to a file
    fs.writeFileSync(outputPath, Buffer.from(midiData, 'binary'));
    console.log('MIDI file saved successfully');
} catch (error) {
    console.error('Error saving MIDI file:', error);
}
