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
// export class PaginationService implements IPaginationService {
//   private isCursorPaginationInput(
//     input: PaginationInput,
//   ): input is CursorPaginationInput {
//     // After normalization use_cursor is a real boolean
//     return Boolean((input as any).use_cursor) === true;
//   }

//   private getValidSortBy(defaultValue: string, value?: string): string {
//     return value && value.trim() !== '' ? value : defaultValue;
//   }

//   private getValidOrder(value?: 'ASC' | 'DESC'): 'ASC' | 'DESC' {
//     return value === 'ASC' || value === 'DESC' ? value : 'DESC';
//   }

//   // For accessing optional filter props without using `any`
//   private asFilterable(input: PaginationInput): PaginationInput &
//     Partial<{
//       search: string;
//       start_date: string;
//       end_date: string;
//     }> &
//     Record<string, unknown> {
//     return input as unknown as PaginationInput &
//       Partial<{
//         search: string;
//         start_date: string;
//         end_date: string;
//       }> & { [key: string]: unknown };
//   }

//   /**
//    * Normalize/Coerce incoming pagination input values.
//    *
//    * Many HTTP frameworks (e.g. Nest + query params) deliver query parameters as strings.
//    * If callers pass that raw object directly into paginate(), fields like "limit", "page"
//    * or "use_cursor" will be strings and lead to incorrect branching:
//    *  - "use_cursor" === "false" is truthy -> cursor branch used unexpectedly
//    *  - "limit" and "page" being strings fail Number.isFinite checks
//    *
//    * This helper coerces common fields into the expected types so paginate() behaves
//    * deterministically regardless of where the input comes from.
//    */
//   private normalizePaginationInput(
//     input: PaginationInput,
//   ): PaginationInput & Record<string, unknown> {
//     const out: Record<string, unknown> = {
//       ...(input as unknown as Record<string, unknown>),
//     };

//     // Coerce boolean-like use_cursor
//     if (typeof out.use_cursor === 'string') {
//       out.use_cursor = out.use_cursor.toLowerCase() === 'true';
//     } else {
//       out.use_cursor = Boolean(out.use_cursor);
//     }

//     // Numeric fields: limit, page
//     if ('limit' in out) {
//       const raw = out.limit;
//       const n = typeof raw === 'number' ? raw : Number(raw as any);
//       out.limit = Number.isFinite(n) ? n : undefined;
//     }

//     if ('page' in out) {
//       const raw = out.page;
//       const n = typeof raw === 'number' ? raw : Number(raw as any);
//       out.page = Number.isFinite(n) ? Math.floor(n) : undefined;
//     }

//     // Cursors should be strings or null
//     if ('next_cursor' in out) {
//       out.next_cursor =
//         out.next_cursor === null || out.next_cursor === undefined
//           ? null
//           : String(out.next_cursor);
//     }
//     if ('previous_cursor' in out) {
//       out.previous_cursor =
//         out.previous_cursor === null || out.previous_cursor === undefined
//           ? null
//           : String(out.previous_cursor);
//     }

//     // sort_by / sort_order / date/search fields as strings if present
//     if ('sort_by' in out && out.sort_by !== undefined && out.sort_by !== null) {
//       out.sort_by = String(out.sort_by);
//     }
//     if (
//       'sort_order' in out &&
//       out.sort_order !== undefined &&
//       out.sort_order !== null
//     ) {
//       const so = String(out.sort_order).toUpperCase();
//       out.sort_order = so === 'ASC' || so === 'DESC' ? so : undefined;
//     }

//     // search / start_date / end_date - keep as strings if present
//     if ('search' in out && out.search !== undefined && out.search !== null) {
//       out.search = String(out.search);
//     }
//     if ('start_date' in out && out.start_date !== undefined) {
//       out.start_date = String(out.start_date);
//     }
//     if ('end_date' in out && out.end_date !== undefined) {
//       out.end_date = String(out.end_date);
//     }

//     return out as PaginationInput & Record<string, unknown>;
//   }

//   async paginate<OrmEntity extends ObjectLiteral, Entity>(
//     queryBuilder: SelectQueryBuilder<OrmEntity>,
//     paginationInput: PaginationInput,
//     mapper: (item: OrmEntity) => Entity,
//     filterOptions?: FilterOptions,
//   ): Promise<PaginatedResult<Entity> | Entity[]> {
//     // Normalize input first to avoid issues caused by string query params
//     const input = this.normalizePaginationInput(paginationInput);

//     this.applyFilters(queryBuilder, input, filterOptions);
//     const orderByField = this.getValidSortBy('id', (input as any).sort_by);
//     const orderByDirection = this.getValidOrder((input as any).sort_order);

//     // Cursor pagination branch
//     if (this.isCursorPaginationInput(input)) {
//       if (!(input as any).limit) {
//         const data = await queryBuilder
//           .orderBy(orderByField, orderByDirection)
//           .getMany();
//         return data.map(mapper);
//       }
//       return this.cursorPaginate(
//         queryBuilder,
//         input as CursorPaginationInput,
//         mapper,
//       );
//     }

//     // Standard pagination: require BOTH limit and page, otherwise return all
//     const standardInput: StandardPaginationInput = {
//       limit: 'limit' in input ? (input as any).limit : undefined,
//       page: 'page' in input ? (input as any).page : undefined,
//       sort_by: (input as any).sort_by,
//       sort_order: (input as any).sort_order,
//       use_cursor: false,
//     };
//     const hasLimit =
//       typeof standardInput.limit === 'number' &&
//       Number.isFinite(standardInput.limit);
//     const hasPage =
//       typeof standardInput.page === 'number' &&
//       Number.isFinite(standardInput.page);

//     if (!(hasLimit && hasPage)) {
//       const data = await queryBuilder
//         .orderBy(orderByField, orderByDirection)
//         .getMany();
//       return data.map(mapper);
//     }

//     return this.standardPaginate(queryBuilder, standardInput, mapper);
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
//     const input = this.asFilterable(paginationInput);
//     const searchValue =
//       typeof input.search === 'string' ? input.search : undefined;
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

//     const input = this.asFilterable(paginationInput);
//     const startDate =
//       typeof input.start_date === 'string' ? input.start_date : undefined;
//     const endDate =
//       typeof input.end_date === 'string' ? input.end_date : undefined;

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
//     const input = this.asFilterable(paginationInput);
//     filterByColumns.forEach((column) => {
//       const parameter = column.split('.')[1] || column;
//       const value = input[parameter];
//       if (
//         value !== undefined &&
//         value !== null &&
//         (typeof value === 'string' ||
//           typeof value === 'number' ||
//           typeof value === 'boolean')
//       ) {
//         queryBuilder.andWhere(`${column} = :${parameter}`, {
//           [parameter]: value,
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
//         this.getValidSortBy('id', sort_by),
//         this.getValidOrder(sort_order),
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
//       const getIdValue = (item: OrmEntity): string | null => {
//         const rec = item as unknown as Record<string, unknown>;
//         const idVal = rec?.id;
//         if (typeof idVal === 'number' || typeof idVal === 'string') {
//           return String(idVal);
//         }
//         return null;
//       };
//       const firstItem = getIdValue(resultData[0]);
//       const lastItem = getIdValue(resultData[resultData.length - 1]);

//       if (firstItem && lastItem) {
//         if (isBackward) {
//           newNextCursor = lastItem;
//           newPreviousCursor = hasMoreItems ? firstItem : null;
//         } else {
//           newNextCursor = hasMoreItems ? lastItem : null;
//           newPreviousCursor = next_cursor ? firstItem : null;
//         }
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
//     const cursorField = this.getValidSortBy('id', sort_by);
//     const order = this.getValidOrder(sort_order);

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
// }
