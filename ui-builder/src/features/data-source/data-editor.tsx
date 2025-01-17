import { ActionIcon, Button, CloseButton, Code, Divider, Menu, Select, Text } from '@mantine/core'
import { openModal } from '@mantine/modals'
import produce from 'immer'
import _ from 'lodash'
import { TbEdit, TbPlus } from 'react-icons/tb'
import { uuid } from '../../utils'
import { ACTIONS } from '../actions'
import {
	Binding,
	BindingKind,
	bindingKinds,
	Condition,
	CONDITIONS,
	RepeatFrom,
} from '../elements/element'
import { useElementsStore } from '../elements/elements-store'
import { ElementEvent, EventKind } from '../elements/event'
import { useSelectedElement } from '../selection/use-selected-component'
import { StatesDefaultValuesForm } from '../states/default-values-form'
import { Expression } from '../states/expression'
import { useGetStates } from '../states/use-get-states'
import { useClassesStore } from '../style/classes-store'
import { Intelinput } from '../ui/intelinput'
import { DataSourceForm } from './data-source-form'
import { DataSource, PropertyKind, useDataSourceStore } from './data-source-store'

export function DataEditor() {
	const element = useSelectedElement()
	const { dataSources } = useDataSourceStore((store) => ({
		dataSources: store.sources,
		addDataSource: store.add,
	}))
	const { set } = useElementsStore((store) => ({
		set: store.set,
	}))
	const states = useGetStates()
	if (!element) return null

	const handleAddEvent = () => {
		set(
			produce(element, (draft) => {
				draft.events.push({ id: uuid(), kind: EventKind.Click, actions: [] })
			})
		)
	}
	const handleAddBinding = (bindingKind: BindingKind) => {
		set(
			produce(element, (draft) => {
				draft.bindings[bindingKind] = { fromStateName: '' }
			})
		)
	}
	const handleAddDataSource = () =>
		openModal({
			children: <DataSourceForm mode="add" />,
			title: 'New API Data Source',
			size: 'xl',
		})
	const editEvent = (event: ElementEvent) => {
		set(
			produce(element, (draft) => {
				draft.events = draft.events.map((e) => (e.id === event.id ? event : e))
			})
		)
	}
	const removeEvent = (event: ElementEvent) => {
		set(
			produce(element, (draft) => {
				draft.events = draft.events.filter((e) => e.id !== event.id)
			})
		)
	}
	const editBinding = (bindingKind: BindingKind, binding: Binding) => {
		set(
			produce(element, (draft) => {
				draft.bindings[bindingKind] = binding
			})
		)
	}
	const removeBinding = (bindingKind: BindingKind) => {
		set(
			produce(element, (draft) => {
				delete draft.bindings[bindingKind]
			})
		)
	}
	const editRepeatFrom = (repeatFrom: RepeatFrom) => {
		set(
			produce(element, (draft) => {
				draft.repeatFrom = repeatFrom
			})
		)
	}

	const events = element.events.map((event) => (
		<EventInput
			key={event.id}
			event={event}
			changeEvent={(newEvent: ElementEvent) => editEvent(newEvent)}
			removeEvent={() => removeEvent(event)}
		/>
	))

	const bindings = _.toPairs(element.bindings)
		.filter((b): b is [BindingKind, Binding] => !!b[1])
		.map(([bindingKind, binding]) => (
			<BindingInput
				key={bindingKind}
				kind={bindingKind}
				binding={binding}
				stateNames={states.map((stateName) => stateName.name)}
				onChange={(binding: Binding) => editBinding(bindingKind, binding)}
				removeBinding={() => removeBinding(bindingKind)}
			/>
		))

	const sources = dataSources.map((dataSource) => (
		<DataSourceItem key={dataSource.id} dataSource={dataSource} />
	))

	const remainingBindings = bindingKinds.filter((binding) => !element.bindings[binding])

	return (
		<div>
			<Button
				variant="light"
				fullWidth
				size="xs"
				my="xs"
				onClick={() =>
					openModal({
						title: 'States Default Values',
						children: <StatesDefaultValuesForm />,
					})
				}
			>
				States Default Values
			</Button>
			<Divider label="Events" mb="xs" />
			<div className="space-y-4">{events}</div>
			<Button mt="md" leftIcon={<TbPlus />} size="xs" onClick={handleAddEvent}>
				Event
			</Button>

			<Divider label="Data bindings" mt="xl" mb="xs" />
			<div className="space-y-4">{bindings}</div>
			<Menu width={150} shadow="sm" position="bottom-start">
				<Menu.Target>
					<Button mt="md" leftIcon={<TbPlus />} size="xs">
						Binding
					</Button>
				</Menu.Target>

				<Menu.Dropdown>
					{remainingBindings.map((kind) => (
						<Menu.Item key={kind} onClick={() => handleAddBinding(kind)}>
							{kind}
						</Menu.Item>
					))}
				</Menu.Dropdown>
			</Menu>

			<RepeatInput
				states={states}
				repeatFrom={element.repeatFrom}
				onChange={(value) =>
					editRepeatFrom({
						name: value,
						iterator: value.replace('$store.source.', '')
							? `${value.replace('$store.source.', '').replaceAll('.', '_')}Item`
							: '',
					})
				}
			/>

			<Divider label="API Data" mt="xl" mb="xs" />
			<div className="space-y-4">{sources}</div>
			<Button mt="md" leftIcon={<TbPlus />} size="xs" onClick={handleAddDataSource}>
				API Data Source
			</Button>
		</div>
	)
}

function RepeatInput({
	repeatFrom,
	onChange,
	states,
}: {
	repeatFrom: RepeatFrom | null
	onChange: (value: string) => void
	states: { kind: PropertyKind; name: string }[]
}) {
	return (
		<div>
			<div className="flex items-center gap-2 mt-10">
				<Text color="dimmed" size="xs" className="w-24 whitespace-nowrap shrink-0">
					Repeat for each
				</Text>
				<Select
					size="xs"
					data={states
						.filter((state) => state.kind === PropertyKind.Array)
						.map((state) => ({
							label: state.name.replace('$store.source.', ''),
							value: state.name,
						}))}
					className="grow"
					value={repeatFrom?.name ?? ''}
					onChange={(value) => onChange(value ?? '')}
					clearable
				/>
			</div>
			{repeatFrom?.iterator && (
				<div className="flex items-center gap-2 mt-2">
					<Text color="dimmed" size="xs" className="w-24 whitespace-nowrap shrink-0">
						as
					</Text>
					<Code>{repeatFrom.iterator}</Code>
				</div>
			)}
		</div>
	)
}

function DataSourceItem({ dataSource }: { dataSource: DataSource }) {
	const { remove } = useDataSourceStore((store) => ({
		remove: store.remove,
		edit: store.edit,
	}))

	return (
		<div className="space-y-2">
			<div className="flex justify-end gap-1">
				<ActionIcon
					size="xs"
					onClick={() =>
						openModal({
							children: <DataSourceForm mode="edit" initialValues={dataSource} />,
							title: 'Edit Data Source',
							size: 'xl',
						})
					}
				>
					<TbEdit />
				</ActionIcon>
				<CloseButton size="xs" onClick={() => remove(dataSource.id)} />
			</div>
			<div className="flex items-center gap-2">
				<Text color="dimmed" size="xs" className="w-8 shrink-0">
					Fetch
				</Text>
				<Code className="grow">{dataSource.stateName}</Code>
			</div>
			<div className="flex items-center gap-2">
				<Text color="dimmed" size="xs" className="w-8 shrink-0">
					from
				</Text>
				<Code className="overflow-x-auto grow no-scrollbar max-w-[237px]">
					{dataSource.url.toString()}
				</Code>
			</div>
		</div>
	)
}

export const eventOptions = [
	{ label: 'click', value: EventKind.Click },
	{ label: 'mouse enter', value: EventKind.MouseEnter },
	{ label: 'mouse leave', value: EventKind.MouseLeave },
	{ label: 'key down', value: EventKind.KeyDown },
	{ label: 'change', value: EventKind.Change },
	{ label: 'submit', value: EventKind.Submit },
	{ label: 'load', value: EventKind.Onload },
	{ label: 'intersection', value: EventKind.Intersection },
]

function EventInput({
	event,
	changeEvent,
	removeEvent,
}: {
	event: ElementEvent
	changeEvent: (newEvent: ElementEvent) => void
	removeEvent: () => void
}) {
	return (
		<div className="flex items-center gap-2">
			<Text size="xs" color="dimmed">
				On
			</Text>
			<Select
				value={event.kind}
				data={eventOptions}
				onChange={(value: EventKind) => changeEvent({ ...event, kind: value })}
				placeholder="event"
				size="xs"
			/>
			<Text size="xs" color="dimmed">
				do
			</Text>
			<Menu shadow="sm" width={350} position="bottom-end" withinPortal>
				<Menu.Target>
					<Button variant="outline" size="xs">
						Action
					</Button>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>Edit actions</Menu.Label>
					{event.actions.map((action) => (
						<div key={action.id} className="flex items-center gap-2 px-2 py-1">
							<Menu.Item
								onClick={() =>
									openModal({
										title: action.name,
										children: action.renderSettings({
											event: event.id,
											action: action.id,
										}),
									})
								}
							>
								{action.name}
							</Menu.Item>
							<CloseButton
								size="xs"
								onClick={() =>
									changeEvent({
										...event,
										actions: event.actions.filter((a) => action.id !== a.id),
									})
								}
							/>
						</div>
					))}

					<Menu.Divider />
					<div className="p-2">
						<Menu width={200} withinPortal position="left-start" shadow="md">
							<Menu.Target>
								<Button size="xs" fullWidth leftIcon={<TbPlus />}>
									Action
								</Button>
							</Menu.Target>
							<Menu.Dropdown>
								{ACTIONS.map((Action) => {
									const action = new Action()
									return (
										<Menu.Item
											key={action.name}
											onClick={() => {
												openModal({
													title: action.name,
													children: action.renderSettings(
														{
															event: event.id,
															action: action.id,
														},
														event.kind
													),
												})
												changeEvent({
													...event,
													actions: [...event.actions, action],
												})
											}}
										>
											{action.name}
										</Menu.Item>
									)
								})}
							</Menu.Dropdown>
						</Menu>
					</div>
				</Menu.Dropdown>
			</Menu>
			<CloseButton size="xs" onClick={removeEvent} />
		</div>
	)
}

function BindingInput({
	stateNames,
	onChange,
	binding,
	removeBinding,
	kind,
}: {
	stateNames: string[]
	onChange: (binding: Binding) => void
	binding: Binding
	kind: BindingKind
	removeBinding: () => void
}) {
	const states = useGetStates()
	const classNames = useClassesStore((store) => store.classes)
	const classNameList = _.keys(classNames)

	const classBinding =
		kind === BindingKind.Class ? (
			<div className="space-y-2">
				<div className="flex items-center gap-1 w-full">
					<span>add</span>
					<Code>{kind}</Code>
					<Select
						placeholder="Select class"
						data={classNameList}
						value={binding.class}
						onChange={(value) => onChange({ ...binding, class: value ?? undefined })}
						size="xs"
						className="grow"
					/>
				</div>
				<div className="flex items-center gap-1 w-full">
					<Text color="dimmed" size="xs">
						if
					</Text>
					<Select
						size="xs"
						data={stateNames.map((name) => ({
							label: name.replace('$store.source.', ''),
							value: name,
						}))}
						className="grow"
						value={binding.fromStateName}
						onChange={(value) => onChange({ ...binding, fromStateName: value ?? '' })}
					/>
				</div>
			</div>
		) : (
			<div className="flex items-center gap-2">
				<div className="flex items-center w-12 gap-1">
					<Code>{kind}</Code>
					<Text color="dimmed" size="xs">
						if
					</Text>
				</div>
				<Select
					size="xs"
					data={stateNames.map((name) => ({
						label: name.replace('$store.source.', ''),
						value: name,
					}))}
					className="grow"
					value={binding.fromStateName}
					onChange={(value) => onChange({ ...binding, fromStateName: value ?? '' })}
				/>
			</div>
		)

	return (
		<div className="space-y-2">
			<CloseButton size="xs" ml="auto" onClick={removeBinding} />
			{classBinding}
			<Select
				size="xs"
				data={CONDITIONS}
				className="grow"
				value={binding.condition}
				onChange={(value) => onChange({ ...binding, condition: value as Condition })}
			/>
			<div className="flex items-center gap-2">
				<Text color="dimmed" size="xs" className="w-12">
					value
				</Text>
				<div className="grow">
					<Intelinput
						options={states.map((s) => s.name)}
						onChange={(value) => onChange({ ...binding, value })}
						value={binding.value ?? new Expression()}
					/>
				</div>
			</div>
		</div>
	)
}
