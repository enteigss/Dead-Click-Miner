document.addEventListener('click', function(event) {
  let element = event.target;
  // Check if the element or its parents are clickable
  if (element.closest('a, button, input[type="submit"], input[type="button"]')) {
    return; // It's a valid, clickable element
  }

  // If we got here, it's likely a dead click
  const data = {
    store_url: window.location.hostname,
    page_path: window.location.pathname,
    target_selector: getCssSelector(element) // You'll need a function for this
  };

  // Send the data to your API
  const apiUrl = 'http://localhost:3000/api/track';
  
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(console.error);
}, true); // Use capture phase to be safe

// Helper function to generate a unique CSS selector for an element
function getCssSelector(el) {
  if (el.id) {
    return `${el.tagName.toLowerCase()}#${el.id}`;
  }
  
  if (el.className) {
    return `${el.tagName.toLowerCase()}.${el.className.split(' ').join('.')}`;
  }
  
  let selector = el.tagName.toLowerCase();
  let parent = el.parentElement;
  
  if (parent) {
    let index = Array.from(parent.children).indexOf(el) + 1;
    selector = `${getCssSelector(parent)} > ${selector}:nth-child(${index})`;
  }
  
  return selector;
}