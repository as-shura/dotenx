import { zodResolver } from '@hookform/resolvers/zod'
import _ from 'lodash'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { z } from 'zod'
import {
	getAutomations,
	getTriggerDefinition,
	getTriggerKinds,
	QueryKey,
	TriggerData,
} from '../../api'

const schema = z.object({
	name: z.string().min(1),
	type: z.string().min(1),
	pipeline_name: z.string().min(1),
	integration: z.string().optional(),
})

type Schema = z.infer<typeof schema>

export function useTriggerForm({
	onSave,
	defaultValues,
	setIntegrationKind,
}: {
	onSave: (values: TriggerData) => void
	defaultValues?: TriggerData
	setIntegrationKind?: (value: string) => void
}) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		getValues,
		setValue,
	} = useForm<Schema>({
		defaultValues: defaultValues,
		resolver: zodResolver(schema),
	})
	const triggerType = watch('type')
	const triggerTypesQuery = useQuery(QueryKey.GetTriggerTypes, getTriggerKinds)
	const automationsQuery = useQuery(QueryKey.GetAutomations, getAutomations)
	const triggerDefinitionQuery = useQuery(
		[QueryKey.GetTriggerDefinition, triggerType],
		() => getTriggerDefinition(triggerType),
		{ enabled: !!triggerType }
	)
	const integrationTypes = triggerDefinitionQuery.data?.data.integrations
	const triggers = triggerTypesQuery?.data?.data.triggers
	const triggerOptions = _.entries(triggers).map(([group, triggers]) => ({
		group,
		options: triggers.map((trigger) => ({
			label: trigger.type,
			value: trigger.type,
			iconUrl: trigger.icon_url,
		})),
	}))
	const selectedTriggerType = _.values(triggers)
		.flat()
		.find((trigger) => trigger.type === triggerType)
	const onSubmit = handleSubmit(() =>
		onSave({
			...(getValues() as TriggerData),
			iconUrl: selectedTriggerType?.icon_url,
		})
	)
	const automationOptions = automationsQuery?.data?.data.map((automation) => ({
		label: automation.name,
		value: automation.name,
	}))

	useEffect(() => {
		if (setIntegrationKind && integrationTypes) setIntegrationKind(integrationTypes[0])
	}, [integrationTypes, setIntegrationKind])

	return {
		onSubmit,
		control,
		errors,
		triggerOptions,
		selectedTriggerType,
		automationsQuery,
		automationOptions,
		integrationTypes,
		triggerDefinitionQuery,
		setValue,
		triggerType,
	}
}

export type UseTriggerForm = ReturnType<typeof useTriggerForm>
