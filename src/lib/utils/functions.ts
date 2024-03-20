export function addSeparator(str: string, separator = ",") {
  if (/\D/g.test(str)) {
    console.error(`String "${str}" is non-numeric.`)
    return str
  }

  let result = '';
  let count = 0;
  const numeric = String(Number(str))

  for (let i = numeric.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      result = separator + result;
    }
    result = numeric.charAt(i) + result;
    count++;
  }

  return result || str;
}

export function scrollIntoViewIfNeeded(elementId: HTMLElement | string) {
  setTimeout(() => {
    const element = typeof elementId == 'string' ? document.getElementById(elementId) : elementId;
    if (!element) {
      console.error(`Cannot find element with id '${elementId}'.`);
      return;
    }

    const rect = element.getBoundingClientRect();
    const isVerticallyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    const isHorizontallyVisible = rect.left >= 0 && rect.right <= window.innerWidth;

    if (!isVerticallyVisible || !isHorizontallyVisible) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  })
}