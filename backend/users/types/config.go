package types

import "errors"

type ServiceConfig struct {
	DbUri string
}

func (c *ServiceConfig) Validate() error {
	if c.DbUri == "" {
		return errors.New("missing db uri")
	}
	return nil
}
