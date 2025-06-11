import { FieldValues, FormState } from "react-hook-form";

export class ValidatorUtils<T extends FieldValues> {
  private _formState: FormState<T> | undefined = undefined;

  set formState(value: FormState<T>) {
    this._formState = value;
  }

  public getError(name: keyof T): string | undefined {
    if (this._formState == null) return undefined;
    return this._formState.errors[name]?.message as string | undefined;
  }

  public hasError(name: keyof T): boolean {
    return this.getError(name) != null;
  }

  public isTouched(name: keyof T): boolean {
    if (this._formState == null) return false;
    return (this._formState.touchedFields as Record<keyof T, boolean>)[name];
  }

  public showError(name: keyof T): boolean {
    return this.hasError(name) && this.isTouched(name);
  }
}
