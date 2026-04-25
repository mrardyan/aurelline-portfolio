.PHONY: dev studio build deploy install help

.DEFAULT_GOAL := help

dev: ## Start the portfolio app (Vite, http://localhost:5173)
	bun run dev

studio: ## Start Sanity Studio (http://localhost:3333)
	cd studio && bun run dev

build: ## Build the portfolio for production
	bun run build

deploy: ## Deploy Sanity Studio to *.sanity.studio
	cd studio && bun run deploy

install: ## Install dependencies for both app and studio
	bun install && cd studio && bun install

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*##' Makefile | awk 'BEGIN {FS = ":.*## "}; {printf "  %-10s %s\n", $$1, $$2}'
