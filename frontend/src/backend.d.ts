import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export enum CoatingType {
    doubleSagwanpatti = "doubleSagwanpatti",
    double_ = "double",
    laminate = "laminate",
    single = "single"
}
export interface backendInterface {
    getCoatingRate(coatingType: CoatingType): Promise<bigint>;
    getDoubleRate(): Promise<bigint>;
    getDoubleSagwanpattiRate(): Promise<bigint>;
    getLaminateRate(): Promise<bigint>;
    getSingleRate(): Promise<bigint>;
    updateCoatingRate(coatingType: CoatingType, newRate: bigint): Promise<void>;
}
