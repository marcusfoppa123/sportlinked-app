import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProfileCard from "@/components/ProfileCard";
import { UserRole } from "@/context/AuthContext";

const ScoutContent = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">{t("scout.title")}</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">{t("scout.searchTitle")}</h2>
        <Card className="shadow-sm">
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sport">{t("scout.sportLabel")}</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("scout.sportPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basketball">{t("scout.basketball")}</SelectItem>
                    <SelectItem value="soccer">{t("scout.soccer")}</SelectItem>
                    <SelectItem value="tennis">{t("scout.tennis")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">{t("scout.positionLabel")}</Label>
                <Input id="position" placeholder={t("scout.positionPlaceholder")} />
              </div>
            </div>
            <Button>{t("scout.searchButton")}</Button>
          </CardContent>
        </Card>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">{t("scout.submitTitle")}</h2>
        <Card className="shadow-sm">
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="athleteName">{t("scout.athleteNameLabel")}</Label>
                <Input id="athleteName" placeholder={t("scout.athleteNamePlaceholder")} />
              </div>
              <div>
                <Label htmlFor="athleteSport">{t("scout.athleteSportLabel")}</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("scout.athleteSportPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basketball">{t("scout.basketball")}</SelectItem>
                    <SelectItem value="soccer">{t("scout.soccer")}</SelectItem>
                    <SelectItem value="tennis">{t("scout.tennis")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="athleteBio">{t("scout.athleteBioLabel")}</Label>
              <Textarea id="athleteBio" placeholder={t("scout.athleteBioPlaceholder")} />
            </div>
            <Button>{t("scout.submitButton")}</Button>
          </CardContent>
        </Card>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">{t("scout.resourcesTitle")}</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{t("scout.resource1Title")}</AccordionTrigger>
            <AccordionContent>{t("scout.resource1Content")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t("scout.resource2Title")}</AccordionTrigger>
            <AccordionContent>{t("scout.resource2Content")}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">{t("scout.featuredTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileCard
            user={{
              name: "John Davis",
              role: "athlete" as UserRole,
              id: "athlete-john-davis" // Add unique ID
            }}
            sport="Basketball"
            position="Guard"
          />
          <ProfileCard
            user={{
              name: "Sarah Johnson",
              role: "athlete" as UserRole,
              id: "athlete-sarah-johnson" // Add unique ID
            }}
            sport="Soccer"
            position="Forward"
          />
          <ProfileCard
            user={{
              name: "Emily White",
              role: "athlete" as UserRole,
              id: "athlete-emily-white" // Add unique ID
            }}
            sport="Tennis"
          />
        </div>
      </section>
    </div>
  );
};

export default ScoutContent;
