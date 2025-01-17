import produce from 'immer'
import { ReactNode } from 'react'
import imageUrl from '../../assets/components/footer-simple-with-input-7.png'
import { deserializeElement } from '../../utils/deserialize'
import { box, form, frame, img, input, link, submit, txt } from '../elements/constructor'
import { BoxElement } from '../elements/extensions/box'
import { ButtonElement } from '../elements/extensions/button'
import { ImageElement } from '../elements/extensions/image'
import { LinkElement } from '../elements/extensions/link'
import { TextElement } from '../elements/extensions/text'
import { useSelectedElement } from '../selection/use-selected-component'
import { ButtonStyler } from '../simple/stylers/button-styler'
import { ImageStyler } from '../simple/stylers/image-styler'
import { LinkStyler } from '../simple/stylers/link-styler'
import { TextStyler } from '../simple/stylers/text-styler'
import { Component, ElementOptions } from './component'
import { DividerCollapsible } from './helpers'
import { ComponentWrapper } from './helpers/component-wrapper'
import { DndTabs } from './helpers/dnd-tabs'
import { OptionsWrapper } from './helpers/options-wrapper'

export class FooterSimpleWithInput7 extends Component {
	name = 'Simple footer with input - 7 '
	image = imageUrl
	defaultData = deserializeElement(defaultData)

	renderOptions(options: ElementOptions): ReactNode {
		return <FooterSimpleWithInput7Options options={options} />
	}
}

// =============  renderOptions =============

function FooterSimpleWithInput7Options({ options }: { options: ElementOptions }) {
	const component = useSelectedElement<BoxElement>()!
	const logo = component.find<ImageElement>(tagIds.logo)!
	const columnOne = component.find(tagIds.columnOne) as BoxElement
	const columnTwo = component.find(tagIds.columnTwo) as BoxElement
	const columnThree = component.find(tagIds.columnThree) as BoxElement
	const columnFour = component.find(tagIds.columnFour) as BoxElement
	const columnFive = component.find(tagIds.columnFive) as BoxElement
	const bottomText = component.find(tagIds.bottomText) as TextElement
	const colOneHeader = component.find(tagIds.colOneHeader) as TextElement
	const colTwoHeader = component.find(tagIds.colTwoHeader) as TextElement
	const colThreeHeader = component.find(tagIds.colThreeHeader) as TextElement
	const colFourHeader = component.find(tagIds.colFourHeader) as TextElement
	const colFiveHeader = component.find(tagIds.colFiveHeader) as TextElement
	const inputDesc = component.find(tagIds.inputDesc) as TextElement
	const descOne = component.find(tagIds.descOne) as TextElement
	const inputLabel = component.find(tagIds.inputLabel) as TextElement
	const button = component.find(tagIds.button) as ButtonElement
	return (
		<ComponentWrapper name="Simple footer with input - 7">
			<ImageStyler element={logo} />
			<DividerCollapsible closed title="Input">
				<TextStyler label="Title " element={inputLabel} />
				<TextStyler label="Left description" element={descOne} />
				<TextStyler label="Bottom description" element={inputDesc} />
				<ButtonStyler label="Submit button" element={button} />
			</DividerCollapsible>
			<DividerCollapsible closed title="Columns">
				<TextStyler label="Column one header" element={colOneHeader} />

				<DndTabs
					containerElement={columnOne}
					renderItemOptions={(item) => <TopLinksOptions item={item as LinkElement} />}
					insertElement={() => createLink('New link')}
				/>
				<TextStyler label="Column two header" element={colTwoHeader} />
				<DndTabs
					containerElement={columnTwo}
					renderItemOptions={(item) => <TopLinksOptions item={item as LinkElement} />}
					insertElement={() => createLink('New link')}
				/>
				<TextStyler label="Column three header" element={colThreeHeader} />
				<DndTabs
					containerElement={columnThree}
					renderItemOptions={(item) => <TopLinksOptions item={item as LinkElement} />}
					insertElement={() => createLink('New link')}
				/>
				<TextStyler label="Column four header" element={colFourHeader} />
				<DndTabs
					containerElement={columnFour}
					renderItemOptions={(item) => <TopLinksOptions item={item as LinkElement} />}
					insertElement={() => createLink('New link')}
				/>
				<TextStyler label="Column five header" element={colFiveHeader} />
				<DndTabs
					containerElement={columnFive}
					renderItemOptions={(item) => <TopLinksOptions item={item as LinkElement} />}
					insertElement={() => createLink('New link')}
				/>
			</DividerCollapsible>

			<TextStyler label="Bottom text" element={bottomText} />
		</ComponentWrapper>
	)
}

function TopLinksOptions({ item }: { item: LinkElement }) {
	const link = item
	const text = item.children?.[0] as TextElement

	return (
		<OptionsWrapper>
			<LinkStyler label="Link" element={link} />
			<TextStyler label="Text" element={text} />
		</OptionsWrapper>
	)
}

// =============  defaultData =============

const tagIds = {
	logo: 'logo',
	colOneHeader: 'colOneHeader',
	columnOne: 'columnOne',
	colTwoHeader: 'colTwoHeader',
	columnTwo: 'columnTwo',
	columnThree: 'columnThree',
	colThreeHeader: 'colThreeHeader',
	columnFour: 'columnFour',
	colFourHeader: 'colFourHeader',
	columnFive: 'columnFive',
	colFiveHeader: 'colFiveHeader',
	button: 'button',
	inputDesc: 'inputDesc',
	inputLabel: 'inputLabel',
	descOne: 'descOne',
	form: 'form',
	submit: 'submit',
	bottomText: 'bottomText',
}

const logo = img('https://files.dotenx.com/assets/logo1-fwe14we.png')
	.tag(tagIds.logo)
	.alt('Logo')
	.css({
		maxWidth: '100px',
	})

const createLink = (text: string, underline?: boolean) => {
	const l = link()
		.txt(text)
		.href('#')
		.css({
			borderBottomWidth: '2px',
			borderBottomStyle: 'solid',
			borderBottomColor: 'white',
			...(underline
				? {
						textDecoration: 'underline',
				  }
				: {
						textDecoration: 'none',
				  }),
		})
		.cssHover({
			borderBottomColor: '#0e0e0e',
			transition: 'border-bottom-color 0.2s',
			textDecoration: 'none',
		})
	l.children[0].css({
		fontSize: '1rem',
		color: '#000000',
	})
	return l
}

const columnOne = [
	createLink('Link One'),
	createLink('Link Two'),
	createLink('Link Three'),
	createLink('Link Four'),
]
const columnTwo = [
	createLink('Link Five'),
	createLink('Link Six'),
	createLink('Link Seven'),
	createLink('Link Eight'),
]
const columnThree = [
	createLink('Link Nine'),
	createLink('Link Ten'),
	createLink('Link Eleven'),
	createLink('Link Twelve'),
]
const columnFour = [
	createLink('Link Thirteen'),
	createLink('Link Fourteen'),
	createLink('Link Fifteen'),
	createLink('Link Sixteen'),
]
const columnFive = [
	createLink('Link Seventeen'),
	createLink('Link Eighteen'),
	createLink('Link Nineteen'),
	createLink('Link Twenty'),
]

const topFooterLinks = box([
	box([
		txt('Column One')
			.css({
				fontWeight: '600',
				fontSize: '16px',
				textAlign: 'left',
			})
			.tag(tagIds.colOneHeader),
		box(columnOne).tag(tagIds.columnOne).css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start	',
			rowGap: '1rem',
		}),
	])
		.css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start	',
			rowGap: '1rem',
		})
		.cssMobile({}),
	box([
		txt('Column Two').tag(tagIds.colTwoHeader).css({
			fontWeight: '600',
			fontSize: '16px',
			textAlign: 'left',
		}),
		box(columnTwo).tag(tagIds.columnTwo).css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start',
			rowGap: '1rem',
		}),
	])
		.css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start	',
			rowGap: '1rem',
		})
		.cssMobile({}),
	box([
		txt('Column Three').tag(tagIds.colThreeHeader).css({
			fontWeight: '600',
			fontSize: '16px',
			textAlign: 'left',
		}),
		box(columnThree).tag(tagIds.columnThree).css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start',
			rowGap: '1rem',
		}),
	])
		.css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start	',
			rowGap: '1rem',
		})
		.cssMobile({}),
	box([
		txt('Column Four').tag(tagIds.colFourHeader).css({
			fontWeight: '600',
			fontSize: '16px',
			textAlign: 'left',
		}),
		box(columnFour).tag(tagIds.columnFour).css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start	',
			rowGap: '1rem',
		}),
	])
		.css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start	',
			rowGap: '1rem',
		})
		.cssMobile({}),
	box([
		txt('Column Five').tag(tagIds.colFiveHeader).css({
			fontWeight: '600',
			fontSize: '16px',
			textAlign: 'left',
		}),
		box(columnFive).tag(tagIds.columnFive).css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start	',
			rowGap: '1rem',
		}),
	])
		.css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start	',
			rowGap: '1rem',
		})
		.cssMobile({}),
])
	.css({
		display: 'grid',
		gridTemplateColumns: ' 1fr 1fr 1fr 1fr 1fr',
		alignItems: 'start',
		justifyContent: 'center',
	})
	.cssTablet({ alignItems: 'start', marginTop: '2rem' })
	.cssMobile({ gridTemplateColumns: ' 1fr', rowGap: '3rem' })
const topFooterInput = box([
	box([
		txt('Subscribe')
			.tag(tagIds.inputLabel)
			.css({
				fontSize: '16px',
				fontWeight: '600',
				gridColumn: 'span 3 / span 3',
				textAlign: 'left',
			})
			.cssTablet({}),
		txt('Join our newsletter to stay up to date on features and releases.')
			.tag(tagIds.descOne)
			.css({
				fontSize: '16px',
				gridColumn: 'span 3 / span 3',
				textAlign: 'left',
			})
			.cssTablet({}),
	])
		.css({
			display: 'flex',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'start',
			justifyContent: 'start',
		})
		.cssTablet({})
		.cssMobile({
			marginTop: '3rem',
		}),
	form([
		input().type('text').placeholder('Enter your email address').setName('email').css({
			borderWidth: '1px',
			borderColor: '#000',
			borderStyle: 'solid',
			borderRadius: '5px',
			padding: '10px',
			width: '100%',
			fontSize: '16px',
			fontWeight: '500',
			color: '#6B7280',
			outline: 'none',
			gridColumn: 'span 2 / span 3',
		}),
		submit('Subscribe')
			.tag(tagIds.submit)
			.css({
				backgroundColor: '#000',
				color: '#fff',
				border: 'none',
				padding: '10px',
				borderRadius: '5px',
				fontSize: '16px',
				fontWeight: '500',
				outline: 'none',
				textAlign: 'center',
			})
			.class('submit')
			.tag(tagIds.button),
		txt('By subscribing you agree to with our Privacy Policy')
			.tag(tagIds.inputDesc)
			.css({
				gridColumn: 'span 3 / span 3',

				fontSize: '14px',
			})
			.cssTablet({
				marginBottom: '10px',
			}),
	])
		.tag(tagIds.form)
		.css({
			display: 'grid',
			gridTemplateColumns: '1fr 1fr 1fr ',
			gap: '10px',
		})
		.cssTablet({
			width: '100%',
			marginTop: '1rem',
		})
		.cssMobile({}),
])
	.css({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'start',
		paddingBottom: '3rem',
		justifyContent: 'space-between',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		borderColor: 'black',
	})
	.cssTablet({ flexDirection: 'column', rowGap: '1rem' })
	.cssMobile({
		marginTop: '3rem',
	})

const topFooter = box([topFooterInput, topFooterLinks])
	.css({
		display: 'grid',
		paddingBottom: '3rem',
		gridTemplateColumns: ' 1fr 	',
		rowGap: '4rem',
		borderBottomWidth: '1px',
		borderBottomStyle: 'solid',
		borderColor: 'black',
	})
	.cssTablet({
		gridTemplateColumns: ' 1fr',
		rowGap: '3rem',
		paddingBottom: '2rem',
		minWidth: '300px',
	})
	.cssMobile({
		paddingBottom: '2rem',
		minWidth: '200px',
	})

const bottomFooter = box([
	logo,
	box([
		txt('© 2023 Company name. All rights reserved.')
			.tag(tagIds.bottomText)
			.css({
				fontSize: '14px',
			})
			.cssTablet({})
			.cssMobile({ order: 2, marginTop: '1rem' }),
	])
		.css({
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'start',
			gap: '10px',
			flexWrap: 'wrap',
		})
		.cssTablet({ justifyContent: 'space-between' })
		.cssMobile({
			flexDirection: 'column',
			alignItems: 'start',
		}),
])
	.css({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: '3rem',
		flexWrap: 'wrap',
	})
	.cssTablet({
		paddingTop: '3rem',
	})
	.cssMobile({
		flexDirection: 'column',
		alignItems: 'start',
		paddingTop: '2rem',
	})

const wrapperDiv = frame([topFooter, bottomFooter]).css({
	flexDirection: 'column',
	alignItems: 'stretch',
})

const defaultData = wrapperDiv.serialize()
