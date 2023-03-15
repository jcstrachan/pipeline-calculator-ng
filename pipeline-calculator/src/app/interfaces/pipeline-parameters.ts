export interface IPipelineParameters {
    thetaFunction: string;
    pipelineArcLength: number;
    finiteDifferenceSubintervalAmount: number;
    pipelineOuterDiameter: number;
    pipelineWallThickness: number;
    pipelineElasticityModulus: number;
    pipelineDensity: number;
    seawaterDensity: number;
    spanLength: number;
    elevationGap: number;
    spanShoulderLength: number;
    seafloorStiffness: number;
}
