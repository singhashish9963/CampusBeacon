
export const createFormData = (data, fileKeys = [], jsonKeys = []) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === null || value === undefined) {
      return;
    }

    if (fileKeys.includes(key) && value) {
      const files = Array.isArray(value) ? value : Array.from(value);
      files.forEach((file) => {
        if (file instanceof File) {
          formData.append(key, file);
        }
      });
    } else if (jsonKeys.includes(key) && Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};
