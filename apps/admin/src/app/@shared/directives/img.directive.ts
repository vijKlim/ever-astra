import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AVATAR_DEFAULT_SVG, DEFAULT_SVG } from '../../@core/constants/app.constants';

@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'img'
})
export class ImgDirective implements OnDestroy, OnInit {
	@Input() type: 'user' | 'default' = 'default';
	private el: HTMLElement;

	constructor(el: ElementRef) {
		this.el = el.nativeElement;
	}

	public defaultImg() {
		if (this.type === 'user') {
			return `/${AVATAR_DEFAULT_SVG}`;
		} else {
			return `/${DEFAULT_SVG}`;
		}
	}

	ngOnInit(): void {
		let src = this.el.getAttribute('src');
		if (src && src.indexOf('http') !== 0) {
			src =  `/${src}`;
		}
		this.el.setAttribute('src', src);
		this.el.addEventListener('error', this.onError.bind(this));
		this.el.addEventListener('load', this.onLoad.bind(this));
	}

	private onError() {
		this.removeErrorEvent();

		this.el.style.opacity = '0';

		const src = this.el.getAttribute('src');
		this.el.setAttribute('src', this.defaultImg());
		this.el.setAttribute('data-original-src', src);

		const classList: any = this.el.classList;
		this.el.setAttribute('class', classList.value + ` default-image default-image-${this.type}`);

		this.removeOnLoadEvent();
	}

	private onLoad() {
		this.el.style.opacity = '1';
	}

	private removeErrorEvent() {
		this.el.removeEventListener('error', this.onError);
	}

	private removeOnLoadEvent() {
		this.el.removeEventListener('load', this.onLoad);
	}

	ngOnDestroy() {
		this.removeErrorEvent();
		this.removeOnLoadEvent();
	}
}
