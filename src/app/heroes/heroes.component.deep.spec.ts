import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { HeroesComponent } from './heroes.component';

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'Wonderful Woman', strength: 24 },
      { id: 3, name: 'SuperDude', strength: 55 },
    ];

    mockHeroService = jasmine.createSpyObj([
      'getHeroes',
      'addHero',
      'deleteHero',
    ]);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run ngOnInit
    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    expect(heroComponentDEs.length).toEqual(3);
    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });

  it(`should call heroService.deleteHero when the Hero Component's delete button is clicked`, () => {
    spyOn(fixture.componentInstance, 'delete');
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    //heroComponentDEs[0]
    //  .query(By.css('button'))
    //  .triggerEventHandler('click', { stopPropagation: () => {} });
    //
    // or... alternate way to raise event in child component...
    (<HeroComponent>heroComponentDEs[0].componentInstance).delete.emit(
      undefined
    );
    // yet another way...
    // heroComponentDEs[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();
    const name = 'Mr. Ice';
    // nope...
    //fixture.componentInstance.add(name);
    //fixture.detectChanges();
    //expect(fixture.componentInstance.heroes.length).toBe(4);
    //
    // this instead...
    mockHeroService.addHero.and.returnValue(
      of({ id: 5, name: name, strength: 4 })
    );
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputEl.value = name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement
      .textContent;
    expect(heroText).toContain(name);
  });
});
