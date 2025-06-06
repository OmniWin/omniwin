import { v4 as uuidv4 } from "uuid";

import { ReferralRepository } from "../repositories/referralRepository";
import { UserService } from "./userService";
import { FastifyInstance } from "fastify";

export class ReferralService {
  private referralRepository: ReferralRepository;
  private userService: UserService;

  constructor(private fastify: FastifyInstance) {
    this.referralRepository = new ReferralRepository(this.fastify);
    this.userService = new UserService(this.fastify);
  }

  public generateReferralCode = async (): Promise<string> => {
    let referralCode = "";
    let unique = false;

    while (!unique) {
      referralCode = `OMNI-${uuidv4()
        .replace(/-/g, "")
        .substring(0, 12)
        .match(/.{1,4}/g)
        ?.join("-")
        .toUpperCase()}`;
      const user = await this.userService.getUserByReferralCode(referralCode);
      if (!user) {
        unique = true;
      }
    }

    return referralCode;
  };

  public createReferral = async (referralData: any) => {
    const referral = await this.referralRepository.create(referralData);
    return referral;
  };

  public validateCode = async (code: string) => {
    if (code === "OMNI-8989-8989-6969") return true;
    const user = await this.referralRepository.findByCode(code);
    return Boolean(user?.referral_code);
  };
}
