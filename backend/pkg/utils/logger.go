package utils

import (
	"log"

	"github.com/davecgh/go-spew/spew"
)

func SpewLog(msg string, data interface{}) {
	log.Println(msg, spew.Sdump(data))
}
