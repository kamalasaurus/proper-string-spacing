import proper_string_spacing from "./proper-string-spacing.js"

function addString() {
  const defaults = [0.046, 0.036, 0.026, 0.017, 0.013, 0.010]

  const string_container = document.getElementById('string-container')
  const existing_strings = document.getElementsByClassName('string-thickness')
  const current_string = existing_strings.length

  const string_thickness = document.createElement('input')
    string_thickness.classList.add('string-thickness')
    string_thickness.setAttribute('data-string', current_string)
    string_thickness.setAttribute('type', 'number')
    string_thickness.setAttribute('name', 'string-thickness[]')
    string_thickness.setAttribute('min', 0.001)
    string_thickness.setAttribute('step', 0.001)
    string_thickness.setAttribute('value', defaults[current_string] || 0.001)

  const label = document.createElement('label')
    label.textContent = `${current_string + 1}: `

  const container = document.createElement('div')
    container.appendChild(label)
    container.appendChild(string_thickness)

  string_container.appendChild(container)
}

function removeString() {
  const strings = document.getElementsByClassName('string-thickness')
  const last_string = Array
    .from(strings)
    .sort((a, b) => a.getAttribute('data-string') > b.getAttribute('data-string'))
    .pop()

  last_string && last_string.parentNode.remove()
}

function handleSubmit() {
  const input = document.getElementById('input')
  const output = document.getElementById('output')
  output.textContent = ''

  const form_data = new FormData(input)
  const distance_between_outer_strings = form_data
    .getAll('distance-between-outer-strings')
    .map(parseFloat).pop()
  const string_thicknesses = form_data
    .getAll('string-thickness[]')
    .map(parseFloat)

  const offsets = proper_string_spacing(distance_between_outer_strings, string_thicknesses)

  offsets.map(distance => {
    const el = document.createElement('div')
    el.textContent = parseFloat(distance).toFixed(3)
    return el
  }).reduce((out, el) => {
    output.appendChild(el)
    return out
  }, output)
}

void function() {
  Array.from({length: 6}).forEach(addString)

  window.addString = addString
  window.removeString = removeString
  window.handleSubmit = handleSubmit
}();
