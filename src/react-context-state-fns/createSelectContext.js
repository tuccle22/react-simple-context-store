/**
 * 
 * @param {*} useUpdateStore 
 * @param {*} param1 
 */
const createSelectContext = contextObj => {
  function useSelectedContext(selectStore) {
    const useUpdate = selectStore(contextObj);
    return useUpdate()
  }
  return useSelectedContext
}

export default createSelectContext