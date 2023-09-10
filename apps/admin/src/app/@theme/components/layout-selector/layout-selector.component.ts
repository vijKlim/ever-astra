import { Component, OnInit, Input } from '@angular/core';
import {ComponentLayoutStyleEnum} from "@ever-astrada/common";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComponentEnum } from '../../../@core/constants';
import {Store} from "../../../@core/data/store.service";

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-layout-selector',
	templateUrl: './layout-selector.component.html',
	styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
	public layoutStyles = ComponentLayoutStyleEnum;

	@Input() componentName: ComponentEnum;
	componentLayoutStyle: ComponentLayoutStyleEnum;

	constructor(private readonly store: Store) {}

	ngOnInit() {
		this.store.componentLayoutMap$
			.pipe(untilDestroyed(this))
			.subscribe(
				(componentLayoutMap: Map<string, ComponentLayoutStyleEnum>) => {
					const dataLayout = componentLayoutMap.get(
						this.componentName
					);
					this.componentLayoutStyle = dataLayout;
				}
			);
	}

	changeLayout(layout: ComponentLayoutStyleEnum) {
		this.store.setLayoutForComponent(this.componentName, layout);
	}


}
