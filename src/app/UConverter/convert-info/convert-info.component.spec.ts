import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertInfoComponent } from './convert-info.component';

describe('ConvertInfoComponent', () => {
	let component: ConvertInfoComponent;
	let fixture: ComponentFixture<ConvertInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ConvertInfoComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConvertInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
