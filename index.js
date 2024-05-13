import proper_string_spacing from "./proper-string-spacing"

function addString() {
  const defaults = [0.046, 0.036, 0.026, 0.017, 0.013, 0.010]

  const input = document.getElementById('input')
  const existing_strings = document.getElementsByClassName('string-thickness')
  const current_string = existing_strings.length

  const string_thickness = document.createElement('input')
    string_thickness.classList.add('string-thickness')
    string_thickness.setAttribute('data-string', current_string)
    string_thickness.setAttribute('type', 'number')
    string_thickness.setAttribute('name', 'string_thickness[]')
    string_thickness.setAttribute('min', '0.001')
    string_thickness.setAttribute('value', defaults[current_string] || '0.001')

  input.appendChild(string_thickness)
}

function removeString() {
  const strings = document.getElementsByClassName('string-thickness')
  const last_string = Array
    .from(strings)
    .sort((a, b) => a.getAttribute('data-string') > b.getAttribute('data-string'))
    .pop()

  last_string && last_string.remove()
}

function handleSubmit() {
  const input = document.getElementById('input')
  const output = document.getElementById('output')
  output.textContent = ''

  const form_data = new FormData(input)
  const distance_between_outer_strings = form_data.get('distance-between-outer-strings')
  const string_thicknesses = form_data.get('string-thickness[]')

  const offsets = proper_string_spacing(distance_between_outer_strings, string_thicknesses)

  offsets.map(distance => {
    const el = document.createElement('div')
    el.textContent = distance
    return el
  }).reduce((out, el) => {
    output.appendChild(el)
    return out
  }, output)
}

void function() {
  Array.from({length: 6}).forEach(addString)
}();
