import React, { ReactNode } from 'react';
import { getExplorerLink } from "@/app/utils";
import { LinkType } from '@/app/types';

interface ExplorerLinkProps {
    network: string;
    identifier: string;
    linkType: LinkType;
    children: ReactNode; // Accept any valid React node as children
}

export const ExplorerLink = ({ network, identifier, linkType, children }: ExplorerLinkProps) => (
    <a href={getExplorerLink(network, linkType, identifier)} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
);