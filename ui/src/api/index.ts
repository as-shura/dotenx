import axios from 'axios'
import {
	CreateAutomationRequest,
	CreateIntegrationRequest,
	CreateTriggerRequest,
	GetAutomationExecutionsResponse,
	GetAutomationResponse,
	GetAutomationsResponse,
	GetAutomationTriggersResponse,
	GetExecutionResultResponse,
	GetIntegrationKindFieldsResponse,
	GetIntegrationKindsResponse,
	GetIntegrationsByKindsResponse,
	GetIntegrationsResponse,
	GetTaskFieldsResponse,
	GetTaskKindsResponse,
	GetTriggerDefinitionResponse,
	GetTriggerKindsResponse,
	GetTriggersResponse,
} from './types'
export * from './types'

export const API_URL = process.env.REACT_APP_API_URL

const api = axios.create({
	baseURL: API_URL,
})

export function createAutomation(payload: CreateAutomationRequest) {
	return api.post<void>('/pipeline', payload)
}

export function getAutomations() {
	return api.get<GetAutomationsResponse>('/pipeline')
}

export function getAutomation(name: string) {
	return api.get<GetAutomationResponse>(`/pipeline/name/${name}`)
}

export function startAutomation(endpoint: string) {
	return api.post<void>(`/execution/ep/${endpoint}/start`, {})
}

export function deleteAutomation(name: string) {
	return api.delete<void>(`/pipeline/name/${name}`)
}

export function createIntegration(payload: CreateIntegrationRequest) {
	return api.post<void>('/integration', payload)
}

export function getIntegrations() {
	return api.get<GetIntegrationsResponse>(`/integration`)
}

export function getIntegrationKinds() {
	return api.get<GetIntegrationKindsResponse>('/integration/avaliable')
}

export function getIntegrationsByKinds(kinds: string[]) {
	const typesQuery = kinds.map((type) => `type=${type}&`)
	return api.get<GetIntegrationsByKindsResponse>(`/integration?${typesQuery}`)
}

export function getIntegrationKindFields(kind: string) {
	return api.get<GetIntegrationKindFieldsResponse>(`/integration/type/${kind}/fields`)
}

export function deleteIntegration(name: string) {
	return api.delete<void>(`/integration/name/${name}`)
}

export function createTrigger(payload: CreateTriggerRequest) {
	return api.post<void>('/trigger', payload)
}

export function getTriggers() {
	return api.get<GetTriggersResponse>('/trigger')
}

export function getAutomationTriggers(name: string) {
	return api.get<GetAutomationTriggersResponse>(`/trigger`, { params: { pipeline: name } })
}

export function getTriggerKinds() {
	return api.get<GetTriggerKindsResponse>('/trigger/avaliable')
}

export function getTriggerDefinition(kind: string) {
	return api.get<GetTriggerDefinitionResponse>(`/trigger/type/${kind}/definition`)
}

export function deleteTrigger(name: string, automationName: string) {
	return api.delete<void>(`/trigger/name/${name}?pipeline=${automationName}`)
}

export function getTaskKinds() {
	return api.get<GetTaskKindsResponse>('/task')
}

export function getTaskFields(kind: string) {
	return api.get<GetTaskFieldsResponse>(`/task/${kind}/fields`)
}

export function getExecutionResult(executionId: string, taskName: string) {
	return api.get<GetExecutionResultResponse>(
		`/execution/id/${executionId}/task_name/${taskName}/result`
	)
}

export function getAutomationExecutions(name: string) {
	return api.get<GetAutomationExecutionsResponse>(`/pipeline/name/${name}/executions`)
}
