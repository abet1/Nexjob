'use client';

import { useMemo, useState } from 'react';
import { useSignal, initData, type User } from '@telegram-apps/sdk-react';
import { List, Placeholder, Section, Button } from '@telegram-apps/telegram-ui';
import { Link } from '@/components/Link/Link';
import { Cell, Image } from '@telegram-apps/telegram-ui'; 

import tonSvg from '../_assets/ton.svg'; // Ensure this path is correct

import { DisplayData, type DisplayDataRow } from '@/components/DisplayData/DisplayData';
import { Page } from '@/components/Page';

function getCompanyRows(company: User): DisplayDataRow[] {
  return [
    { title: 'Company Name', value: company.username || 'N/A' }, // Assuming username is used for company name
    { title: 'Industry', value: 'Tech/Software' }, // Add relevant industry information or make it dynamic
    { title: 'Number of Job Postings', value: '5' }, // Example number, replace with dynamic value
    { title: 'Verified Company', value: company.isPremium ? 'Yes' : 'No' },
  ];
}

export default function CompanyProfilePage() {
  const initDataRaw = useSignal(initData.raw);
  const initDataState = useSignal(initData.state);

  const [jobCount, setJobCount] = useState<number>(5); // Example job count, can be dynamic

  // Prepare data to be displayed on the page
  const companyDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initDataState || !initDataRaw) {
      return undefined;
    }
    const {
      authDate,
    } = initDataState;
    return [
      { title: 'Number of Active Job Postings', value: jobCount },
      { title: 'Date Joined', value: authDate.toLocaleString() },
      { title: 'Company Verification Status', value: 'Verified' }, // Static or dynamic
      { title: 'Connect TON Wallet', value: (
        <Link href="/ton-connect">
          <Cell
            before={
              <Image
                src={tonSvg.src}
                style={{ backgroundColor: '#007AFF' }}
              />
            }
            subtitle="Connect your TON wallet to manage points and rewards"
          >
            TON Connect
          </Cell>
        </Link>
      ) },
    ];
  }, [initDataState, initDataRaw, jobCount]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initDataState && initDataState.user
      ? getCompanyRows(initDataState.user)
      : undefined;
  }, [initDataState]);

  if (!companyDataRows) {
    return (
      <Page>
        <Placeholder
          header="Oops"
          description="Application was launched with missing init data"
        >
          <img
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            style={{ display: 'block', width: '144px', height: '144px' }}
          />
        </Placeholder>
      </Page>
    );
  }

  return (
    <Page>
      <List>
        <DisplayData header={'Company Profile'} rows={companyDataRows} />
        {userRows && <DisplayData header={'Company Details'} rows={userRows} />}

        {/* Call to Action for Company Profile */}
        <Section header="Manage Your Company Profile">
          <p>Post new job listings and manage your company information to attract the best candidates.</p>
          <Link href="/post-job">
            <Button>Post a New Job</Button>
          </Link>
        </Section>

        {/* Job Management Section */}
        <Section header="Job Management">
          <p>Review and manage active job postings, track applicants, and update job details.</p>
          <Link href="/manage-jobs">
            <Button>Manage Jobs</Button>
          </Link>
        </Section>

        {/* Social media links section */}
        <Section footer="Connect with us">
          <Link href="https://facebook.com/Nexhire">
            <Cell>Facebook</Cell>
          </Link>
          <Link href="https://twitter.com/Nexhire">
            <Cell>Twitter</Cell>
          </Link>
          <Link href="https://linkedin.com/company/Nexhire">
            <Cell>LinkedIn</Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
}
