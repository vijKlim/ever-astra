import {Component, OnInit} from '@angular/core';
import {Store} from "./@core/data/store.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguagesService} from "./@core/services";
import {LanguagesEnum} from "@ever-astrada/common";

@Component({
  selector: 'ea-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'admin';
  loading: boolean = true;
  constructor(
    private readonly store: Store,
    private readonly languagesService: LanguagesService,
    public readonly translate: TranslateService,
  ) {

  }

  ngOnInit() {
    this.translate.setDefaultLang(LanguagesEnum.ENGLISH);
    this.translate.use(
      LanguagesEnum.ENGLISH
    );
    this.translate.onLangChange.subscribe(() => {
      this.loading = false;
    });

    console.log(this.translate.getDefaultLang())
  }


}
