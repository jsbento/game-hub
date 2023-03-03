package utils

func StringPointer(s string) *string {
	return &s
}

func IntPointer(i int) *int {
	return &i
}

func BoolPointer(b bool) *bool {
	return &b
}

func FloatPointer(f float64) *float64 {
	return &f
}
