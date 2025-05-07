export function validateFileFormat(fileName: string, allowedFileFormat: string[]) {
	const fileParts = fileName.split('.')
	const extension = fileParts[fileParts.length - 1]

	return allowedFileFormat.includes(extension)
}
