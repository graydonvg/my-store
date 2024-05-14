import { GridValidRowModel } from "@mui/x-data-grid";

export function getChangedDataGridValues(newObj: GridValidRowModel, oldObj: GridValidRowModel) {
	const changedValues: GridValidRowModel = {};

	// Iterate over all properties in obj1
	for (let key in newObj) {
		// Check if the property exists in obj2 and has a different value
		if (newObj[key] !== oldObj[key]) {
			if (newObj[key] === '') {
				// Names and contact number not required.
				// Set empty strings to null to prevent empty string in db
				changedValues[key] = null;
			} else {
				changedValues[key] = newObj[key];
			}
		}
	}

	return changedValues;
}