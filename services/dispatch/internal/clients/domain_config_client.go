package clients

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/user/ai-ride-hailing/services/domain-config/internal/models"
)

type DomainConfigClient struct {
	baseURL string
}

func NewDomainConfigClient() *DomainConfigClient {
	url := os.Getenv("DOMAIN_CONFIG_SERVICE_URL")
	if url == "" {
		url = "http://localhost:8085"
	}
	return &DomainConfigClient{baseURL: url}
}

func (c *DomainConfigClient) GetDomainConfig(domainType string) (*models.DomainConfiguration, error) {
	resp, err := http.Get(fmt.Sprintf("%s/api/v1/config/domains/%s", c.baseURL, domainType))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch config, status: %d", resp.StatusCode)
	}

	var configs []models.DomainConfiguration
	// Mock: The service returns a list for now, we'll filter or change API to return single
	if err := json.NewDecoder(resp.Body).Decode(&configs); err != nil {
		return nil, err
	}
	
	for _, config := range configs {
		if string(config.DomainType) == domainType {
			return &config, nil
		}
	}

	return nil, fmt.Errorf("config not found for domain: %s", domainType)
}
