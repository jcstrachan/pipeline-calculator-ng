export interface IPipelineParameters {
    finiteDifferenceSubintervalAmount: number;
    pipelineOuterDiameter: number;
    pipelineWallThickness: number;
    pipelineElasticityModulus: number;
    pipelineDensity: number;
    seawaterDensity: number;
    spanLength: number;
    elevationGap: number;
    spanShoulderLength: number;
    effectiveAxialTension: number;
    seafloorStiffness: number;
}
