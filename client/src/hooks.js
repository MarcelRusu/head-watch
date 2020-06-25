import {useState, useEffect} from 'react';

// Like `useState` but will update state when watchArr change (usually props)
// Example:
// const Component = ({prop}) => {
//   const [state, setState] = useFreshState(prop, [prop]);
// }
// Normally in this example with useState, if prop changes, state won't change
// but with useFreshState it will always be up to date
export const useFreshState = (initState, watchArr) => {
  if (!(watchArr instanceof Array)) throw new Error('Need `watchArr` when using `useFreshState`');
  if (typeof initState === 'function') initState = initState();
  const [state, setState] = useState(initState);
  useEffect(() => {
    setState(initState)
  }, watchArr);
  return [state, setState];
}

// returned array is Array<[elem, setElem, removeElem]>
// This is used to make it easier to update array elements when using `useState`
// before you would have to do setState(arr => arr.map(x => ~[cond]~ ? newElem : x)
// now when you do `const [arr, setArray] = useArray([])` it returns array of tuples to use like so
// arr.map(([elem, setElem, removeElem]) => ... setElem(newValue)) ... removeElem()
// No need to iterate through the array to find the element to update
// IF YOU USE THIS DO NOT MUTATE THE ARRAY SINCE THIS DEPENDS ON THE INDEX!!
export const useArray = (init, watchArr = null) => {
  if (!(init instanceof Array)) throw `${init} not an Array!`;
  const [array, setArray] = useFreshState(init, watchArr);
  const updateElem = (update, i) => setArray(arr => arr.map((old, j) => {
    if (j !== i) return old;
    if (typeof update === 'function') {
      return update(old);
    } else {
      return update;
    }
  }));
  const removeElem = i => setArray(arr => arr.filter((_, j) => i !== j));

  const elements = array.map((elem, i) => [
    elem,
    elem => updateElem(elem, i),
    () => removeElem(i) 
  ]);

  return [elements, setArray]
}