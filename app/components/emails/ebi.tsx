import * as React from "react";
import { EBIResult } from "../../lib/ebi";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
} from "@react-email/components";
import { CodeBlock, dracula } from "@react-email/components";

export const EBIPremiumDiscountAlert: React.FC<Readonly<EBIResult>> = ({
  premium_discount,
  median_30_day_spread,
}) => {
  return (
    <Html>
      <Tailwind>
        <Head>
          <title>EBI ETF Premium Discount Alert</title>
          <Preview>
            URGENT: EBI ETF Premium Discount Has Reached Critical Levels
          </Preview>
        </Head>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto p-[24px] max-w-[600px]">
            <Section className="mb-[32px]">
              <Heading className="text-[24px] font-bold text-red-600 mb-[16px] m-0">
                🚨 URGENT: EBI ETF Premium Discount Alert
              </Heading>
              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[24px]">
                Dear Investor,
              </Text>
              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[24px]">
                We&apos;re reaching out with an <strong>important alert</strong>{" "}
                regarding your EBI ETF investment. Our monitoring system has
                detected that the premium discount for the EBI ETF has fallen to{" "}
                <strong className="text-red-600">dangerously low levels</strong>
                .
              </Text>
            </Section>

            <Section className="mb-[32px] bg-red-50 p-[16px] rounded-[8px] border-l-[4px] border-red-600">
              <Text className="text-[18px] font-bold text-gray-800 mb-[16px]">
                Current Status:
              </Text>

              <Row className="mb-[16px]">
                <Column className="px-[8px]">
                  <table
                    className="w-full border-collapse"
                    cellPadding="0"
                    cellSpacing="0"
                    role="presentation"
                  >
                    <thead>
                      <tr>
                        <th className="text-left p-[8px] border-b-[1px] border-red-200 text-[14px] font-bold text-gray-700">
                          Metric
                        </th>
                        <th className="text-right p-[8px] border-b-[1px] border-red-200 text-[14px] font-bold text-gray-700">
                          Value
                        </th>
                        <th className="text-right p-[8px] border-b-[1px] border-red-200 text-[14px] font-bold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-left p-[8px] border-b-[1px] border-red-100 text-[14px] text-gray-700">
                          Current Premium Discount
                        </td>
                        <td className="text-right p-[8px] border-b-[1px] border-red-100 text-[14px] font-bold text-red-600">
                          {premium_discount}%
                        </td>
                        <td className="text-right p-[8px] border-b-[1px] border-red-100 text-[14px]">
                          <span className="bg-red-600 text-white px-[8px] py-[4px] rounded-[4px] text-[12px] font-bold">
                            CRITICAL
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left p-[8px] border-b-[1px] border-red-100 text-[14px] text-gray-700">
                          Median 30 Day Spread
                        </td>
                        <td className="text-right p-[8px] border-b-[1px] border-red-100 text-[14px] font-bold text-gray-700">
                          {median_30_day_spread}%
                        </td>
                        <td className="text-right p-[8px] border-b-[1px] border-red-100 text-[14px]">
                          <span className="bg-green-600 text-white px-[8px] py-[4px] rounded-[4px] text-[12px] font-bold">
                            NORMAL
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left p-[8px] text-[14px] text-gray-700">
                          Safe Range
                        </td>
                        <td className="text-right p-[8px] text-[14px] font-bold text-gray-700">
                          -0.2% to 0.2%
                        </td>
                        <td className="text-right p-[8px] text-[14px]">
                          <span className="bg-blue-600 text-white px-[8px] py-[4px] rounded-[4px] text-[12px] font-bold">
                            TARGET
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Column>
              </Row>

              <Text className="text-[14px] leading-[20px] text-red-700 italic mt-[8px] mb-0">
                * Current discount is significantly outside the safe operating
                range
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[24px]">
                This significant deviation could indicate:
              </Text>
              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[8px]">
                • Potential market inefficiencies
              </Text>
              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[8px]">
                • Arbitrage opportunities for sophisticated investors
              </Text>
              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[24px]">
                • Increased risk of price volatility in the short term
              </Text>
              <Text className="text-[16px] leading-[24px] text-gray-700 mb-[24px]">
                <strong>Immediate action may be required</strong> to protect
                your investment or capitalize on this temporary market
                condition.
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Button
                className="bg-blue-600 text-white font-bold py-[12px] px-[24px] rounded-[4px] no-underline text-center block box-border"
                href="https://longviewresearchpartners.com/charts/"
              >
                View EBI fund data
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const EBIDetailsUnavailableEmail = ({
  errorMessage,
  result,
}: {
  errorMessage: string;
  result: object;
}) => {
  return (
    <Html>
      <Tailwind>
        <Head>
          <title>EBI Details Fetch Warning</title>
          <Preview>Warning: EBI details could not be fetched</Preview>
        </Head>
        <Body className="bg-[#f6f6f6] font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-[#e63946] mt-[0px] mb-[16px]">
                System Warning: EBI Details Unavailable
              </Heading>

              <Text className="text-[16px] leading-[24px] text-[#333] mb-[24px]">
                We were unable to fetch EBI&apos;s details as requested from
                hyperbrowser.
              </Text>

              <Text className="text-[16px] leading-[24px] text-[#333] mb-[8px]">
                <strong>Error Details:</strong>
              </Text>

              <div className="overflow-auto">
                <CodeBlock
                  code={errorMessage}
                  language="json"
                  theme={dracula}
                />
              </div>
              <div className="overflow-auto">
                <CodeBlock
                  code={JSON.stringify(result, null, 2)}
                  language="json"
                  theme={dracula}
                />
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const AlertEmail = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Alert: {title}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-gray-800 my-[16px]">
                Alert: {title}
              </Heading>
              <Text className="text-[16px] text-gray-600 mb-[24px]">
                {message}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
