import { Injectable } from '@nestjs/common';
import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  CursorPaginationInput,
  CursorPaginationResult,
  FilterOptions,
  IPaginationService,
  PaginatedResult,
  PaginationInput,
  StandardPaginationInput,
  StandardPaginationResult,
} from '@common/infrastructure/pagination/pagination.interface';

@Injectable()
// export class PaginationService implements IPaginationService {
//   private isCursorPaginationInput(
//     input: PaginationInput,
//   ): input is CursorPaginationInput {
//     return input.use_cursor;
//   }

//   async paginate<OrmEntity extends ObjectLiteral, Entity>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     paginationInput: PaginationInput,
//     mapper: (item: OrmEntity) => Entity,
//     filterOptions?: FilterOptions,
//   ): Promise<PaginatedResult<Entity> | Entity[]> {
//     this.applyFilters(queryBuilder, paginationInput, filterOptions);
//     if (!paginationInput.limit) {
//       const data = await queryBuilder
//         .orderBy(
//           this.getValidSortValue('id', paginationInput.sort_by),
//           this.getValidSortValue('DESC', paginationInput.sort_order),
//         )
//         .getMany();
//       return data.map(mapper);
//     }

//     if (this.isCursorPaginationInput(paginationInput)) {
//       return this.cursorPaginate(queryBuilder, paginationInput, mapper);
//     } else {
//       return this.standardPaginate(queryBuilder, paginationInput, mapper);
//     }
//   }

//   private applyFilters<OrmEntity extends ObjectLiteral>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     paginationInput: PaginationInput,
//     filterOptions?: FilterOptions,
//   ): void {
//     if (filterOptions) {
//       this.filterBySearchColumn(
//         queryBuilder,
//         paginationInput,
//         filterOptions.searchColumns,
//       );
//       this.filterByDate(
//         queryBuilder,
//         paginationInput,
//         filterOptions.dateColumn,
//       );
//       this.filterByColumns(
//         queryBuilder,
//         paginationInput,
//         filterOptions.filterByColumns,
//       );
//     }
//   }

//   private filterBySearchColumn<OrmEntity extends ObjectLiteral>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     paginationInput: PaginationInput,
//     searchColumns?: string[],
//   ): void {
//     const searchValue = (paginationInput as any).search;
//     if (searchValue && searchColumns && searchColumns.length > 0) {
//       queryBuilder.andWhere(
//         new Brackets((qb) => {
//           searchColumns.forEach((column) => {
//             qb.orWhere(`${column} ILIKE :searchValue`, {
//               searchValue: `%${searchValue}%`,
//             });
//           });
//         }),
//       );
//     }
//   }

//   private filterByDate<OrmEntity extends ObjectLiteral>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     paginationInput: PaginationInput,
//     dateColumn?: string,
//   ): void {
//     if (!dateColumn) return;

//     const startDate = (paginationInput as any).start_date;
//     const endDate = (paginationInput as any).end_date;

//     if (startDate && endDate) {
//       queryBuilder.andWhere(
//         `DATE(${dateColumn}) BETWEEN :startDate AND :endDate`,
//         {
//           startDate,
//           endDate,
//         },
//       );
//     }
//   }

//   private filterByColumns<OrmEntity extends ObjectLiteral>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     paginationInput: PaginationInput,
//     filterByColumns?: string[],
//   ): void {
//     if (!filterByColumns) return;
//     filterByColumns.forEach((column) => {
//       const parameter = column.split('.')[1] || column;
//       if ((paginationInput as any)[parameter]) {
//         queryBuilder.andWhere(`${column} = :${parameter}`, {
//           [parameter]: (paginationInput as any)[parameter],
//         });
//       }
//     });
//   }

//   private async standardPaginate<OrmEntity extends ObjectLiteral, Entity>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     {
//       limit = 10,
//       page = 1,
//       sort_by = 'id',
//       sort_order = 'DESC',
//     }: StandardPaginationInput,
//     mapper: (item: OrmEntity) => Entity,
//   ): Promise<StandardPaginationResult<Entity>> {
//     const total = await queryBuilder.getCount();
//     const total_pages = Math.ceil(total / limit);
//     page = Math.max(1, Math.min(page, total_pages));

//     const [data, totalData] = await queryBuilder
//       .orderBy(
//         this.getValidSortValue('id', sort_by),
//         this.getValidSortValue('DESC', sort_order),
//       )
//       .take(limit)
//       .skip((page - 1) * limit)
//       .getManyAndCount();

//     return {
//       data: data.map(mapper),
//       pagination: {
//         total: totalData,
//         total_pages,
//         limit,
//         page,
//       },
//     };
//   }

//   private async cursorPaginate<OrmEntity extends ObjectLiteral, Entity>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     {
//       limit = 10,
//       next_cursor,
//       previous_cursor,
//       sort_by = 'id',
//       sort_order = 'DESC',
//     }: CursorPaginationInput,
//     mapper: (item: OrmEntity) => Entity,
//   ): Promise<CursorPaginationResult<Entity>> {
//     const isBackward = Boolean(previous_cursor);
//     this.applyCursorPagination(queryBuilder, {
//       use_cursor: true,
//       limit,
//       next_cursor,
//       previous_cursor,
//       sort_by,
//       sort_order,
//     });

//     // Fetch one extra item to determine if there are more pages
//     const data = await queryBuilder.take(limit + 1).getMany();
//     const hasMoreItems = data.length > limit;

//     if (hasMoreItems) {
//       data.pop(); // Remove the extra item
//     }

//     // If navigating backward, reverse the order of results
//     const resultData = isBackward ? data.reverse() : data;

//     let newNextCursor: string | null = null;
//     let newPreviousCursor: string | null = null;

//     if (resultData.length > 0) {
//       const firstItem = resultData[0]['id'].toString();
//       const lastItem = resultData[resultData.length - 1]['id'].toString();

//       if (isBackward) {
//         newNextCursor = lastItem;
//         newPreviousCursor = hasMoreItems ? firstItem : null;
//       } else {
//         newNextCursor = hasMoreItems ? lastItem : null;
//         newPreviousCursor = next_cursor ? firstItem : null;
//       }
//     }

//     return {
//       data: resultData.map(mapper),
//       pagination: {
//         limit,
//         next_cursor: newNextCursor,
//         previous_cursor: newPreviousCursor,
//       },
//     };
//   }

//   private applyCursorPagination<OrmEntity extends ObjectLiteral>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     {
//       next_cursor,
//       previous_cursor,
//       sort_by,
//       sort_order,
//     }: CursorPaginationInput,
//   ) {
//     const cursorField = this.getValidSortValue('id', sort_by);
//     const order = this.getValidSortValue('DESC', sort_order);

//     if (next_cursor) {
//       queryBuilder.andWhere(
//         `${cursorField} ${order === 'ASC' ? '>' : '<'} :next_cursor`,
//         {
//           next_cursor,
//         },
//       );
//     }

//     if (previous_cursor) {
//       queryBuilder.andWhere(
//         `${cursorField} ${order === 'ASC' ? '<' : '>'} :previous_cursor`,
//         {
//           previous_cursor,
//         },
//       );
//       queryBuilder.addOrderBy(cursorField, order === 'ASC' ? 'DESC' : 'ASC');
//     } else {
//       queryBuilder.addOrderBy(cursorField, order);
//     }
//   }

//   private getValidSortValue(defaultValue: string, value?: any): any {
//     return value && value.trim() !== '' ? value : defaultValue;
//   }
// }
export class PaginationService implements IPaginationService {
  private isCursorPaginationInput(
    input: PaginationInput,
  ): input is CursorPaginationInput {
    return input.use_cursor;
  }

  private getValidSortBy(defaultValue: string, value?: string): string {
    return value && value.trim() !== '' ? value : defaultValue;
  }

  private getValidOrder(value?: 'ASC' | 'DESC'): 'ASC' | 'DESC' {
    return value === 'ASC' || value === 'DESC' ? value : 'DESC';
  }

  // For accessing optional filter props without using `any`
  private asFilterable(input: PaginationInput): PaginationInput &
    Partial<{
      search: string;
      start_date: string;
      end_date: string;
    }> &
    Record<string, unknown> {
    return input as unknown as PaginationInput &
      Partial<{
        search: string;
        start_date: string;
        end_date: string;
      }> & { [key: string]: unknown };
  }

  async paginate<OrmEntity extends ObjectLiteral, Entity>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    mapper: (item: OrmEntity) => Entity,
    filterOptions?: FilterOptions,
  ): Promise<PaginatedResult<Entity> | Entity[]> {
    this.applyFilters(queryBuilder, paginationInput, filterOptions);
    const orderByField = this.getValidSortBy('id', paginationInput.sort_by);
    const orderByDirection = this.getValidOrder(paginationInput.sort_order);

    // Cursor pagination branch
    if (this.isCursorPaginationInput(paginationInput)) {
      if (!paginationInput.limit) {
        const data = await queryBuilder
          .orderBy(orderByField, orderByDirection)
          .getMany();
        return data.map(mapper);
      }
      return this.cursorPaginate(queryBuilder, paginationInput, mapper);
    }

    // Standard pagination: require BOTH limit and page, otherwise return all
    const standardInput: StandardPaginationInput = {
      limit:
        'limit' in paginationInput ? (paginationInput as any).limit : undefined,
      page:
        'page' in paginationInput ? (paginationInput as any).page : undefined,
      sort_by: paginationInput.sort_by,
      sort_order: paginationInput.sort_order,
      use_cursor: false,
    };
    const hasLimit =
      typeof standardInput.limit === 'number' &&
      Number.isFinite(standardInput.limit);
    const hasPage =
      typeof standardInput.page === 'number' &&
      Number.isFinite(standardInput.page);

    if (!(hasLimit && hasPage)) {
      const data = await queryBuilder
        .orderBy(orderByField, orderByDirection)
        .getMany();
      return data.map(mapper);
    }

    return this.standardPaginate(queryBuilder, standardInput, mapper);
  }

  private applyFilters<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    filterOptions?: FilterOptions,
  ): void {
    if (filterOptions) {
      this.filterBySearchColumn(
        queryBuilder,
        paginationInput,
        filterOptions.searchColumns,
      );
      this.filterByDate(
        queryBuilder,
        paginationInput,
        filterOptions.dateColumn,
      );
      this.filterByColumns(
        queryBuilder,
        paginationInput,
        filterOptions.filterByColumns,
      );
    }
  }

  private filterBySearchColumn<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    searchColumns?: string[],
  ): void {
    const input = this.asFilterable(paginationInput);
    const searchValue =
      typeof input.search === 'string' ? input.search : undefined;
    if (searchValue && searchColumns && searchColumns.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          searchColumns.forEach((column) => {
            qb.orWhere(`${column} ILIKE :searchValue`, {
              searchValue: `%${searchValue}%`,
            });
          });
        }),
      );
    }
  }

  private filterByDate<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    dateColumn?: string,
  ): void {
    if (!dateColumn) return;

    const input = this.asFilterable(paginationInput);
    const startDate =
      typeof input.start_date === 'string' ? input.start_date : undefined;
    const endDate =
      typeof input.end_date === 'string' ? input.end_date : undefined;

    if (startDate && endDate) {
      queryBuilder.andWhere(
        `DATE(${dateColumn}) BETWEEN :startDate AND :endDate`,
        {
          startDate,
          endDate,
        },
      );
    }
  }

  private filterByColumns<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    paginationInput: PaginationInput,
    filterByColumns?: string[],
  ): void {
    if (!filterByColumns) return;
    const input = this.asFilterable(paginationInput);
    filterByColumns.forEach((column) => {
      const parameter = column.split('.')[1] || column;
      const value = input[parameter];
      if (
        value !== undefined &&
        value !== null &&
        (typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean')
      ) {
        queryBuilder.andWhere(`${column} = :${parameter}`, {
          [parameter]: value,
        });
      }
    });
  }

  private async standardPaginate<OrmEntity extends ObjectLiteral, Entity>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    {
      limit = 10,
      page = 1,
      sort_by = 'id',
      sort_order = 'DESC',
    }: StandardPaginationInput,
    mapper: (item: OrmEntity) => Entity,
  ): Promise<StandardPaginationResult<Entity>> {
    const total = await queryBuilder.getCount();
    const total_pages = Math.ceil(total / limit);
    page = Math.max(1, Math.min(page, total_pages));

    const [data, totalData] = await queryBuilder
      .orderBy(
        this.getValidSortBy('id', sort_by),
        this.getValidOrder(sort_order),
      )
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();
    return {
      data: data.map(mapper),
      pagination: {
        total: totalData,
        total_pages,
        limit,
        page,
      },
    };
  }

  private async cursorPaginate<OrmEntity extends ObjectLiteral, Entity>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    {
      limit = 10,
      next_cursor,
      previous_cursor,
      sort_by = 'id',
      sort_order = 'DESC',
    }: CursorPaginationInput,
    mapper: (item: OrmEntity) => Entity,
  ): Promise<CursorPaginationResult<Entity>> {
    const isBackward = Boolean(previous_cursor);
    this.applyCursorPagination(queryBuilder, {
      use_cursor: true,
      limit,
      next_cursor,
      previous_cursor,
      sort_by,
      sort_order,
    });

    // Fetch one extra item to determine if there are more pages
    const data = await queryBuilder.take(limit + 1).getMany();
    const hasMoreItems = data.length > limit;

    if (hasMoreItems) {
      data.pop(); // Remove the extra item
    }

    // If navigating backward, reverse the order of results
    const resultData = isBackward ? data.reverse() : data;

    let newNextCursor: string | null = null;
    let newPreviousCursor: string | null = null;

    if (resultData.length > 0) {
      const getIdValue = (item: OrmEntity): string | null => {
        const rec = item as unknown as Record<string, unknown>;
        const idVal = rec?.id;
        if (typeof idVal === 'number' || typeof idVal === 'string') {
          return String(idVal);
        }
        return null;
      };
      const firstItem = getIdValue(resultData[0]);
      const lastItem = getIdValue(resultData[resultData.length - 1]);

      if (firstItem && lastItem) {
        if (isBackward) {
          newNextCursor = lastItem;
          newPreviousCursor = hasMoreItems ? firstItem : null;
        } else {
          newNextCursor = hasMoreItems ? lastItem : null;
          newPreviousCursor = next_cursor ? firstItem : null;
        }
      }
    }

    return {
      data: resultData.map(mapper),
      pagination: {
        limit,
        next_cursor: newNextCursor,
        previous_cursor: newPreviousCursor,
      },
    };
  }

  private applyCursorPagination<OrmEntity extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<OrmEntity>,
    {
      next_cursor,
      previous_cursor,
      sort_by,
      sort_order,
    }: CursorPaginationInput,
  ) {
    const cursorField = this.getValidSortBy('id', sort_by);
    const order = this.getValidOrder(sort_order);

    if (next_cursor) {
      queryBuilder.andWhere(
        `${cursorField} ${order === 'ASC' ? '>' : '<'} :next_cursor`,
        {
          next_cursor,
        },
      );
    }

    if (previous_cursor) {
      queryBuilder.andWhere(
        `${cursorField} ${order === 'ASC' ? '<' : '>'} :previous_cursor`,
        {
          previous_cursor,
        },
      );
      queryBuilder.addOrderBy(cursorField, order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      queryBuilder.addOrderBy(cursorField, order);
    }
  }
}
