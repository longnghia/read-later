/**
 * Save object to JSON file
 */
export function save2Json(data: object) {
  if (data) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], {
      type: 'text/plain',
    }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `read_later_${new Date().toDateString().replaceAll(' ', '_')}.json`;
    link.click();
  }
}
