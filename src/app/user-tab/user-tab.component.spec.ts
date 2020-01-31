/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { UserTabComponent } from "./user-tab.component";

describe("UserTabComponent", () => {
  let component: UserTabComponent;
  let fixture: ComponentFixture<UserTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserTabComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
