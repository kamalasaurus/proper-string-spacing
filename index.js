import proper_string_spacing from "./proper-string-spacing.js"

// output templates
function create_inner_distance(inner_edge_distance) {
  const container = document.createElement('div')
  
  const heading = document.createElement('h4')
    heading.textContent = 'string inner edge distances'
  
  const data = document.createElement('div')
    data.textContent = inner_edge_distance
  
  container.appendChild(heading)
  container.appendChild(data)
  
  return container
}

function create_cell(txt, header = false) {
  const el = document.createElement(header ? 'th' : 'td')
    el.textContent = txt
  return el
}

function create_copy_button(index) {
  const el = document.createElement('span')
    el.textContent = 'copy ↓'
    el.classList.add('copy_button')
    el.setAttribute('data-index', index + 1)
    el.addEventListener('mousedown', handleCopy)
  return el
}

function create_table_header() {
  return ['string ', 'adjacent distances ', 'cumulative distances ']
    .map((txt, i) => {
      const el = create_cell(txt, true)
      const copy_button = create_copy_button(i)
      el.appendChild(copy_button)
      return el
    })
    .reduce((head, el) => {
      head.appendChild(el)
      return head
    }, document.createElement('tr'))
}

function create_table(strings, midline_distances, cumulative_distances) {
  const container = document.createElement('div')

  const header = document.createElement('h4')
    header.textContent = 'string midline distances'

  const table = Array.from({length: strings.length}, ()=> document.createElement('tr'))
    .map((row, i) => {
      row.appendChild(create_cell(strings[i]))
      row.appendChild(create_cell(midline_distances[i]))
      row.appendChild(create_cell(cumulative_distances[i]))
      return row
    }).reduce((tab, row, i) => {
      if (i == 0) tab.appendChild(create_table_header())
      tab.appendChild(row)
      return tab
    }, document.createElement('table'))

    container.appendChild(header)
    container.append(table)

    return container
}

// button methods
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

  const {
    inner_edges, midlines, cumulatives, strings
  } = proper_string_spacing(distance_between_outer_strings, string_thicknesses)

  output.appendChild(create_inner_distance(inner_edges))
  output.appendChild(create_table(strings, midlines, cumulatives))
}

async function handleCopy(e) {
  const data_index = this.getAttribute('data-index')
  const content = Array
    .from(document.querySelectorAll(`tr > td:nth-of-type(${data_index})`))
    .map(el => el.textContent).join('\n')

  try {
    await navigator.clipboard.writeText(content)
  } catch (error) {
    console.error(error.message)
  }
}

// onload function
void function() {
  Array.from({length: 6}).forEach(addString)

  window.addString = addString
  window.removeString = removeString
  window.handleSubmit = handleSubmit
  window.handleCopy = handleCopy
}();
