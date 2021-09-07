import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let heroService: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    heroService = TestBed.inject(HeroService);
  });
  describe('getHero', () => {
    it('should call get with the correct url', () => {
      heroService.getHero(4).subscribe((hero) => {
        expect(hero.id).toBe(4); // avoids NO EXPECTATIONS warning
      });

      const req = httpTestingController.expectOne('api/heroes/4');

      req.flush({ id: 4, name: 'SuperDude', strength: 100 });
      httpTestingController.verify();
    });
  });
});
