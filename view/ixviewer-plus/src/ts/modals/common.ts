/* Created by staff of the U.S. Securities and Exchange Commission.
 * Data and content created by government employees within the scope of their employment
 * are not subject to domestic copyright protection. 17 U.S.C. 105.
 */

import * as bootstrap from "bootstrap";
import { Modals } from "./modals";
import { ModalsContinuedAt } from "./continued-at";
import { FactPages } from "./fact-pages";
import { Pagination } from "../pagination/sideBarPagination";
import { FactMap } from "../facts/map";
import { ConstantsFunctions } from "../constants/functions";
import { ErrorsMinor } from "../errors/minor";
import { defaultKeyUpHandler } from "../helpers/utils";

export const ModalsCommon = {
	currentSlide: 0,
	currentDetailTab: 0,

	carouselInformation: [
		{
			"dialog-title": "Attributes" // Aspects
		},
		{
			"dialog-title": "Labels"
		},
		{
			"dialog-title": "References"
		},
		{
			"dialog-title": "Calculation"
		}
	],

	getAttributes: null,

	clickEvent: (event: Event, element: HTMLElement) => {
		if (event instanceof KeyboardEvent && !(event.key === 'Enter' || event.key === 'Space' || event.key === ' '))
			return;

		event.preventDefault();
		event.stopPropagation();

		const id = element.getAttribute('continued-main-fact-id') || element.getAttribute('id');
		if (!id) {
			ErrorsMinor.factNotFound();
			return;
		}

		document.getElementById("fact-nested-modal")?.classList.add("d-none");
		document.getElementById("fact-modal")?.classList.remove("d-none");
		// document.getElementById("fact-modal-drag")?.focus();

		ModalsCommon.carouselData(element);
		ModalsCommon.createTitles(id, ModalsCommon.currentSlide);
		ModalsCommon.createCarousel();
		ModalsCommon.listeners();

		document.getElementById('fact-modal-jump')?.setAttribute('data-id', id as string);
	},

	listeners: () => {
		const oldActions = document.querySelector('#fact-modal .dialog-header-actions');
		const newActions = (oldActions as HTMLElement).cloneNode(true);
		oldActions?.parentNode?.replaceChild(newActions, oldActions);

		// we add draggable
		Modals.initDrag(document.getElementById("fact-modal-drag") as HTMLElement);

		document.getElementById('fact-modal-jump')?.addEventListener('click', (event: MouseEvent) => {
			Pagination.goToFactInSidebar(event);
		});
		document.getElementById('fact-modal-jump')?.addEventListener('keyup', (event: KeyboardEvent) => {
			if (!defaultKeyUpHandler(event)) return;
			Pagination.goToFactInSidebar(event);
		});

		document.getElementById('fact-modal-copy-content')?.addEventListener('click', (event: MouseEvent) => {
			Modals.copyContent(event, 'fact-modal-carousel', 'fact-copy-content');
		});
		document.getElementById('fact-modal-copy-content')?.addEventListener('keyup', (event: KeyboardEvent) => {
			if (!defaultKeyUpHandler(event)) return;
			Modals.copyContent(event, 'fact-modal-carousel', 'fact-copy-content');
		});

		document.getElementById('fact-modal-compress')?.addEventListener('click', (event: MouseEvent) => {
			Modals.expandToggle(event, 'fact-modal', 'fact-modal-expand', 'fact-modal-compress');
		});
		document.getElementById('fact-modal-compress')?.addEventListener('keyup', (event: KeyboardEvent) => {
			if (!defaultKeyUpHandler(event)) return;
			Modals.expandToggle(event, 'fact-modal', 'fact-modal-expand', 'fact-modal-compress');
		});

		document.getElementById('fact-modal-expand')?.addEventListener('click', (event: MouseEvent) => {
			Modals.expandToggle(event, 'fact-modal', 'fact-modal-expand', 'fact-modal-compress');
		});
		document.getElementById('fact-modal-expand')?.addEventListener('keyup', (event: KeyboardEvent) => {
			if (!defaultKeyUpHandler(event)) return;
			Modals.expandToggle(event, 'fact-modal', 'fact-modal-expand', 'fact-modal-compress');
		});

		document.getElementById('fact-modal-close')?.addEventListener('click', (event: MouseEvent) => {
			Modals.close(event);
		});
		document.getElementById('fact-modal-close')?.addEventListener('keyup', (event: KeyboardEvent) => {
			if (!defaultKeyUpHandler(event)) return;
			Modals.close(event);
		});

		window.addEventListener("keyup", ModalsCommon.keyboardEvents);
	},

	createTitles: (id: string, currentSlide = 0) => {
		if (currentSlide > 0) {
			currentSlide--;
		}
		const factInfo = FactMap.getByID(id);
		const span = document.createElement('span');
		const dialogTitle = document.createTextNode(`${ModalsCommon.carouselInformation[currentSlide]['dialog-title']}`);
		span.appendChild(dialogTitle);
		document.getElementById('fact-modal-title')?.firstElementChild?.replaceWith(span);

		const span1 = document.createElement('span');
		const dialogSubTitle = document.createTextNode(`${ConstantsFunctions.getFactLabel(factInfo?.labels || [])}`);
		span1.appendChild(dialogSubTitle);
		document.getElementById('fact-modal-subtitle')?.firstElementChild?.replaceWith(span1);
	},

	createCarousel: () => {
		new bootstrap.Carousel(document.getElementById('fact-modal-carousel') as HTMLElement, {});
		const thisCarousel = document.getElementById('fact-modal-carousel');

		thisCarousel?.addEventListener('slide.bs.carousel' as any, (event: CarouselEvent) => {
			ModalsCommon.currentSlide = event.to + 1;
			const previousActiveIndicator = event.from;
			const newActiveIndicator = event.to;
			
			document.querySelector(`#fact-modal-carousel-indicators [data-bs-slide-to="${previousActiveIndicator}"]`)?.classList.remove("active");
			document.querySelector(`#fact-modal-carousel-indicators [data-bs-slide-to="${newActiveIndicator}"]`)?.classList.add("active");

			const span = document.createElement('span');
			const dialogTitle = document.createTextNode(`${ModalsCommon.carouselInformation[event.to]['dialog-title']}`);
			span.appendChild(dialogTitle);
			document.getElementById('fact-modal-title')?.firstElementChild?.replaceWith(span);
			ModalsCommon.currentDetailTab = newActiveIndicator;
		});
		bootstrap.Carousel.getInstance(document.getElementById('fact-modal-carousel') as HTMLElement)?.to(ModalsCommon.currentDetailTab);
	},

	focusOnContent: () => {
		document
			.getElementById(
				"fact-modal-carousel-page-" + ModalsCommon.currentSlide
			)?.focus();
	},

	keyboardEvents: (event: KeyboardEvent) => {
		const thisCarousel = bootstrap.Carousel.getInstance(document.getElementById('fact-modal-carousel') as HTMLElement);
		const searchInput = document.getElementById('global-search');
		if (document.activeElement !== searchInput) {
			if (event.key === '1') {
				thisCarousel?.to(0);
				ModalsCommon.focusOnContent();
				return false;
			}
			if (event.key === '2') {
				thisCarousel?.to(1);
				ModalsCommon.focusOnContent();
				return false;
			}
			if (event.key === '3') {
				thisCarousel?.to(2);
				ModalsCommon.focusOnContent();
				return false;
			}
			if (event.key === '4') {
				thisCarousel?.to(3);
				ModalsCommon.focusOnContent();
				return false;
			}
			if (event.key === 'ArrowLeft') {
				thisCarousel?.prev();
				ModalsCommon.focusOnContent();
				return false;
			}
			if (event.key === 'ArrowRight') {
				thisCarousel?.next();
				ModalsCommon.focusOnContent();
				return false;
			}
		}
	},

	carouselData: (element: HTMLElement) => {
		Modals.renderCarouselIndicators(
			"fact-modal-carousel",
			"fact-modal-carousel-indicators",
			ModalsContinuedAt.carouselInformation,
			ModalsCommon.currentSlide
		);
		const id = element.hasAttribute('continued-main-fact-id') ? element.getAttribute('continued-main-fact-id') : element.getAttribute('id');
		const factInfo = FactMap.getByID(id as string);
		if (factInfo) {

			// we now render one slide at a time!
			FactPages.firstPage(factInfo, 'fact-modal-carousel-page-1');
			FactPages.secondPage(factInfo, 'fact-modal-carousel-page-2');
			FactPages.thirdPage(factInfo, 'fact-modal-carousel-page-3');
			FactPages.fourthPage(factInfo, 'fact-modal-carousel-page-4');
			ConstantsFunctions.getCollapseToFactValue();
		}
	},
};
