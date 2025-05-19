class ValidatorHelper {
    validateColor(color) {
        if (!/^#([0-9a-f]{3}){1,2}$/i.test(color)) {
            throw new Error('Color must be a valid hex color')
        }

        return true
    }

    isISO8601 = (value) => {
        const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?$/;
        if (!iso8601Regex.test(value)) {
            throw new Error('Invalid date format. Expected ISO 8601 (YYYY-MM-DDTHH:mm:ss)');
        }
        return true;
    };

    depositObject(obj) {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
          throw new Error('Input must be a plain object.');
        }
      
        for (const [key, value] of Object.entries(obj)) {
          if (typeof key !== 'string') {
            throw new Error(`Invalid key: ${key}. Keys must be strings.`);
          }
          if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new Error(`Invalid value for key "${key}": ${value}. Values must be valid numbers.`);
          }
        }
      
        return true;
      }
}

module.exports = new ValidatorHelper()