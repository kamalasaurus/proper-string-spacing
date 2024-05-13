// Strings have thickness!  This is a generalization of Doug Proper's approach
// to ensure you have appropriate spacing offset in your instrument to ensure
// strings of varying thicknessess maintain constant spacing between them. Works
// for any number of strings.

// Usage:  proper_string_spacing(midline distance between outer strings, [array of
// each string thickness]), the array length will be the number of strings (6 for
// 6 string, 8 for 8 string, 4 for standard bass, etc.).

// The output will be the offset distance of each string from the first string.
function proper_string_spacing(
    distance_between_outer_strings = 1.444,
    string_thicknesses = [0.046, 0.036, 0.026, 0.017, 0.013, 0.010]
) {
    // convenience function for reduce
    const sum = (a, b) => a + b

    // only half diameter of outer strings
    const cumulative_string_thickness = string_thicknesses
        .map((width, i, arr) => {
            return (i == 0 || i == arr.length - 1) ?
                width / 2 :
                width
        }).reduce(sum)

    // even distance between closest edge of each string pair
    const inner_edge_distance = (distance_between_outer_strings - cumulative_string_thickness) /
        (string_thicknesses.length - 1)

    // distance between string midlines
    const midline_distances = Array
        .from({length: string_thicknesses.length - 1}, (_, i) => i + 1)
        .map((i) => {
            const reclaimed_string_thicknesses = string_thicknesses
                .slice(i - 1, i + 1)
                .reduce(sum) / 2
            return inner_edge_distance + reclaimed_string_thicknesses
        })

    // distance of string midlines from first string (use for offset)
    const cumulative_distances = midline_distances
        .map((_, i, arr) => arr.slice(0, i + 1).reduce(sum))
    
    return cumulative_distances
}
